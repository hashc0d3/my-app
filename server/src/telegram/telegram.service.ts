import { Injectable } from "@nestjs/common";
import type { CreateRetailCrmOrderDto } from "../retailcrm/dto/create-order.dto";

@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
    this.chatId = process.env.TELEGRAM_CHAT_ID ?? "";
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    if (!this.botToken || !this.chatId) {
      console.warn(
        "Telegram: credentials не настроены. Проверьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID."
      );
    }
  }

  private buildMessage(dto: CreateRetailCrmOrderDto): string {
    let msg = "<b>Новый заказ</b>\n\n";
    msg += `Номер: ${dto.orderNumber}\n\n`;
    msg += "<b>Товары:</b>\n";
    dto.items.forEach((item, i) => {
      msg += `${i + 1}. ${item.productName} — ${item.quantity} шт., ${item.initialPrice} ₽\n`;
    });
    msg += "\n<b>Клиент:</b>\n";
    msg += `ФИО: ${dto.firstName}\n`;
    msg += `Email: ${dto.email}\n`;
    msg += `Телефон: ${dto.phone}\n\n`;
    msg += "<b>Доставка:</b>\n";
    msg += `Способ: ${dto.deliveryMethod ?? "—"}\n`;
    if (dto.deliveryPoint) msg += `Пункт выдачи: ${dto.deliveryPoint}\n`;
    if (dto.comment) msg += `Комментарий: ${dto.comment}\n`;
    msg += `Стоимость доставки: ${dto.deliveryPrice ?? 0} ₽\n\n`;
    if (dto.promoCode) msg += `Промокод: ${dto.promoCode}\n`;
    msg += `<b>Итого: ${dto.totalPrice} ₽</b>`;
    return msg;
  }

  async sendOrderMessage(dto: CreateRetailCrmOrderDto): Promise<{ success: boolean }> {
    if (!this.botToken || !this.chatId) {
      console.warn("Telegram: пропуск отправки — нет токена или chat_id");
      return { success: false };
    }
    try {
      const body = {
        chat_id: String(this.chatId),
        text: this.buildMessage(dto),
        parse_mode: "HTML"
      };
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
      if (!res.ok || !data.ok) {
        console.error("Telegram API error:", res.status, data);
        return { success: false };
      }
      return { success: true };
    } catch (e) {
      console.error("Telegram send error:", e);
      return { success: false };
    }
  }
}
