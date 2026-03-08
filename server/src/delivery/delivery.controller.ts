import { All, BadRequestException, Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { DeliveryService } from "./delivery.service";

@Controller("public/delivery")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post("cities")
  async searchCities(@Body("query") query: string) {
    return this.deliveryService.searchCities(query ?? "");
  }

  @All("cdek")
  async proxyCdek(@Req() req: Request, @Res() res: Response): Promise<void> {
    const action = (req.query?.action ?? (req.body && (req.body as { action?: string }).action)) as
      | string
      | undefined;
    if (!action) {
      throw new BadRequestException("Action is required");
    }
    try {
      const result = await this.deliveryService.proxyCdekWidget(
        action,
        req.method,
        (req.query as Record<string, unknown>) ?? {},
        req.body
      );
      res.status(200).json(result);
    } catch (e: unknown) {
      const status = (e as { status?: number }).status ?? 500;
      const message = (e as { message?: string }).message ?? "CDEK proxy error";
      res.status(status).json({ message });
    }
  }
}
