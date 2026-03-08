import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "../common/admin-auth.guard";
import { AppConfigService } from "./app-config.service";

@Controller()
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get("public/config")
  getPublic() {
    return this.appConfigService.getConfig();
  }

  @UseGuards(AdminAuthGuard)
  @Put("admin/config")
  save(@Body() body: unknown) {
    const payload = (body as { payload?: unknown })?.payload ?? body;
    return this.appConfigService.saveConfig(payload);
  }

  @Post("public/promocodes/redeem")
  redeemPromo(@Body() body: unknown) {
    const payload = body as { code?: unknown; subtotal?: unknown };
    return this.appConfigService.redeemPromoCode(payload?.code, payload?.subtotal);
  }
}
