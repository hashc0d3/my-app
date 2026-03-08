import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

const TOCHKA_API_URL = "https://enter.tochka.com/uapi/acquiring/v1.0/payments";

export interface CreatePaymentPayload {
  amount: number;
  purpose: string;
  paymentMode?: string[];
  redirectUrl?: string;
  orderId?: string;
}

@Injectable()
export class PaymentsService {
  private readonly customerCode: string;
  private readonly merchantId: string;
  private readonly token: string;

  constructor() {
    this.customerCode = process.env.TOCHKA_CUSTOMER_CODE ?? "";
    this.merchantId = process.env.TOCHKA_MERCHANT_ID ?? "";
    this.token = process.env.TOCHKA_TOKEN ?? "";
    if (!this.customerCode || !this.merchantId || !this.token) {
      console.warn(
        "Точка Банк: credentials не настроены. Проверьте TOCHKA_CUSTOMER_CODE, TOCHKA_MERCHANT_ID, TOCHKA_TOKEN."
      );
    }
  }

  async createPayment(payload: CreatePaymentPayload): Promise<{ paymentLink?: string; raw?: unknown }> {
    let redirectUrl = payload.redirectUrl ?? "https://slavalarionov.com/success";
    if (!redirectUrl.startsWith("https://")) {
      redirectUrl = redirectUrl.replace(/^http:\/\//, "https://");
    }

    const body = {
      Data: {
        customerCode: this.customerCode,
        amount: String(payload.amount),
        purpose: payload.purpose,
        paymentMode: payload.paymentMode ?? ["card", "sbp"],
        redirectUrl,
        merchantId: this.merchantId,
        ...(payload.orderId ? { paymentLinkId: payload.orderId } : {})
      }
    };

    const response = await fetch(TOCHKA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = (await response.json().catch(() => ({}))) as {
      Data?: { paymentLink?: string };
      Message?: string;
    };

    if (!response.ok) {
      const status = response.status as number;
      throw new HttpException(
        { success: false, status, data: data ?? { message: "Точка Банк: ошибка создания платежа" } },
        status
      );
    }

    const paymentLink = data?.Data?.paymentLink;
    return { paymentLink, raw: data };
  }
}
