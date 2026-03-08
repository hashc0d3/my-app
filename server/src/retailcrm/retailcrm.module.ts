import { Module } from "@nestjs/common";
import { RetailCrmController } from "./retailcrm.controller";
import { RetailCrmService } from "./retailcrm.service";
import { TelegramModule } from "../telegram/telegram.module";

@Module({
  imports: [TelegramModule],
  controllers: [RetailCrmController],
  providers: [RetailCrmService]
})
export class RetailCrmModule {}
