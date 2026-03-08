import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRetailCrmOrderDto } from "./dto/create-order.dto";
import { TelegramService } from "../telegram/telegram.service";

@Injectable()
export class RetailCrmService {
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(private readonly telegramService: TelegramService) {
    this.apiUrl = process.env.RETAIL_CRM_API_URL ?? "";
    this.apiToken = process.env.RETAIL_CRM_API_TOKEN ?? "";
    if (!this.apiToken || !this.apiUrl) {
      console.warn(
        "RetailCRM: credentials не настроены. Проверьте RETAIL_CRM_API_URL и RETAIL_CRM_API_TOKEN."
      );
    }
  }

  private cleanProperties(properties: Array<{ name: string; value: string }> | undefined) {
    if (!properties || !Array.isArray(properties)) return [];
    return properties.filter(
      (p) => p.value !== "" && p.value !== null && p.value !== undefined
    );
  }

  async createOrder(dto: CreateRetailCrmOrderDto): Promise<{ success: boolean; data?: unknown }> {
    const items = dto.items.map((item) => ({
      productName: item.productName || "Товар",
      quantity: item.quantity ?? 1,
      initialPrice: item.initialPrice ?? 0,
      properties: this.cleanProperties(item.properties)
    }));

    const order: Record<string, unknown> = {
      number: dto.orderNumber,
      firstName: dto.firstName,
      email: dto.email,
      phone: dto.phone,
      delivery: {
        code: dto.deliveryMethod ?? "cdek-pvz",
        cost: dto.deliveryPrice ?? 0,
        address: {
          text: [dto.deliveryPoint, dto.comment].filter(Boolean).join("; ") || undefined
        }
      },
      items,
      summ: dto.totalPrice
    };

    const params = new URLSearchParams({
      apiKey: this.apiToken,
      order: JSON.stringify(order)
    });

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await response.json().catch(() => ({})) as { success?: boolean; errorMsg?: string };

    if (!response.ok) {
      throw new HttpException(
        {
          success: false,
          status: response.status,
          data: data ?? { message: "RetailCRM: ошибка создания заказа" }
        },
        response.status as HttpStatus
      );
    }

    if (data.success === false) {
      throw new HttpException(
        {
          success: false,
          status: HttpStatus.BAD_REQUEST,
          data: { errorMsg: data.errorMsg ?? "RetailCRM отклонил заказ" }
        },
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await this.telegramService.sendOrderMessage(dto);
    } catch (e) {
      console.error("Telegram notification failed:", e);
    }

    return { success: true, data };
  }
}
