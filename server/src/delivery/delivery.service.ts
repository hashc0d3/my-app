import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";

const CDEK_OAUTH_URL = "https://api.cdek.ru/v2/oauth/token";
const DADATA_SUGGEST_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const CDEK_OFFICES_URL = "https://api.cdek.ru/v2/deliverypoints";
const CDEK_CALC_URL = "https://api.cdek.ru/v2/calculator/tarifflist";

@Injectable()
export class DeliveryService {
  private readonly cdekClientId: string;
  private readonly cdekClientSecret: string;
  private cdekToken: string | null = null;
  private cdekTokenExpiresAt: number | null = null;

  private readonly dadataToken: string;
  private readonly dadataSecret: string;

  constructor() {
    this.cdekClientId = process.env.CDEK_CLIENT_ID ?? "";
    this.cdekClientSecret = process.env.CDEK_CLIENT_SECRET ?? "";
    this.dadataToken = process.env.DADATA_API_KEY ?? "";
    this.dadataSecret = process.env.DADATA_SECRET ?? "";
    if (!this.cdekClientId || !this.cdekClientSecret) {
      console.warn("CDEK: credentials не настроены. Проверьте CDEK_CLIENT_ID и CDEK_CLIENT_SECRET.");
    }
  }

  private ensureCdekCredentials(): void {
    if (!this.cdekClientId || !this.cdekClientSecret) {
      throw new InternalServerErrorException("CDEK credentials are not configured");
    }
  }

  private async getCdekToken(): Promise<string> {
    this.ensureCdekCredentials();
    const now = Date.now();
    if (this.cdekToken && this.cdekTokenExpiresAt && now < this.cdekTokenExpiresAt) {
      return this.cdekToken;
    }
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.cdekClientId,
      client_secret: this.cdekClientSecret
    });
    const res = await fetch(CDEK_OAUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: params.toString()
    });
    const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
    if (!res.ok || !data.access_token) {
      const err = (data as { error_description?: string }).error_description ?? "CDEK OAuth failed";
      throw new InternalServerErrorException(err);
    }
    this.cdekToken = data.access_token;
    const ttl: number =
      data.expires_in != null && Number.isFinite(data.expires_in) ? data.expires_in : 3600;
    this.cdekTokenExpiresAt = now + (ttl - 60) * 1000;
    return this.cdekToken;
  }

  async proxyCdekWidget(
    action: string,
    method: string,
    query: Record<string, unknown>,
    body: unknown
  ): Promise<unknown> {
    this.ensureCdekCredentials();
    const token = await this.getCdekToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    };

    if (action === "offices") {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (k !== "action" && v !== undefined && v !== null && v !== "")
          params.set(k, String(v));
      });
      const url = `${CDEK_OFFICES_URL}?${params.toString()}`;
      const res = await fetch(url, { method: "GET", headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new InternalServerErrorException("Не удалось получить список ПВЗ CDEK");
      return data;
    }

    if (action === "calculate") {
      const payload = method === "POST" && body && typeof body === "object" && !Array.isArray(body)
        ? { ...(body as Record<string, unknown>) }
        : { ...query };
      delete (payload as Record<string, unknown>).action;

      const res = await fetch(CDEK_CALC_URL, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new InternalServerErrorException("Не удалось рассчитать доставку CDEK");
      return data;
    }

    throw new BadRequestException(`Unsupported CDEK widget action: ${action}`);
  }

  async searchCities(query: string): Promise<Array<{ value: string; city?: string; postal_code?: string }>> {
    if (!query?.trim()) return [];
    if (!this.dadataToken || !this.dadataSecret) {
      console.warn("Dadata: credentials не настроены. Проверьте DADATA_API_KEY и DADATA_SECRET.");
      return [];
    }
    const res = await fetch(DADATA_SUGGEST_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${this.dadataToken}`,
        "X-Secret": this.dadataSecret,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query.trim(),
        count: 10,
        from_bound: { value: "city" },
        to_bound: { value: "settlement" },
        restrict_value: true
      })
    });
    const data = (await res.json().catch(() => ({}))) as { suggestions?: Array<{ value: string; data?: { city?: string; postal_code?: string } }> };
    const list = data.suggestions ?? [];
    return list.map((s) => ({
      value: s.value,
      city: s.data?.city,
      postal_code: s.data?.postal_code
    }));
  }
}
