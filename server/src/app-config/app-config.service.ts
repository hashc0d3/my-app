import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const CONFIG_ID = "app";

@Injectable()
export class AppConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getConfig() {
    const row = await this.prisma.appConfig.findUnique({ where: { id: CONFIG_ID } });
    return row?.payload ?? {};
  }

  async saveConfig(payload: unknown) {
    if (!payload || typeof payload !== "object") {
      throw new BadRequestException("Config payload must be an object");
    }

    const row = await this.prisma.appConfig.upsert({
      where: { id: CONFIG_ID },
      update: { payload },
      create: { id: CONFIG_ID, payload }
    });

    return row.payload;
  }

  async redeemPromoCode(rawCode: unknown, rawSubtotal: unknown) {
    const code = String(rawCode ?? "").trim().toLowerCase();
    const subtotal = Number(rawSubtotal ?? 0);
    if (!code) {
      throw new BadRequestException("Promo code is required");
    }
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      throw new BadRequestException("Subtotal must be a non-negative number");
    }

    const row = await this.prisma.appConfig.findUnique({ where: { id: CONFIG_ID } });
    const payload = (row?.payload ?? {}) as {
      promoCodes?: Array<{
        id?: string;
        code?: string;
        type?: "amount" | "percent";
        value?: number;
        remainingUses?: number;
      }>;
    };

    const promoCodes = Array.isArray(payload.promoCodes) ? [...payload.promoCodes] : [];
    const promoIdx = promoCodes.findIndex(
      (promo) => String(promo.code ?? "").trim().toLowerCase() === code
    );
    if (promoIdx < 0) {
      throw new BadRequestException("Промокод не найден");
    }

    const promo = promoCodes[promoIdx];
    const remainingUses = Number(promo.remainingUses ?? 0);
    const type = promo.type === "percent" ? "percent" : "amount";
    const value = Math.max(0, Number(promo.value ?? 0));

    if (remainingUses <= 0) {
      throw new BadRequestException("Промокод закончился");
    }

    const rawDiscount = type === "percent" ? subtotal * (value / 100) : value;
    const discount = Math.max(0, Math.min(subtotal, Math.round(rawDiscount)));
    const total = Math.max(0, subtotal - discount);

    promoCodes[promoIdx] = {
      ...promo,
      type,
      value,
      remainingUses: remainingUses - 1
    };

    await this.prisma.appConfig.upsert({
      where: { id: CONFIG_ID },
      update: {
        payload: {
          ...(payload as Record<string, unknown>),
          promoCodes
        }
      },
      create: {
        id: CONFIG_ID,
        payload: {
          ...(payload as Record<string, unknown>),
          promoCodes
        }
      }
    });

    return {
      code: promo.code,
      type,
      value,
      discount,
      total,
      remainingUses: remainingUses - 1
    };
  }
}
