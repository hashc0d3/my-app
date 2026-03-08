import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ContentModule } from "./content/content.module";
import { MediaModule } from "./media/media.module";
import { PaymentsModule } from "./payments/payments.module";
import { RetailCrmModule } from "./retailcrm/retailcrm.module";
import { DeliveryModule } from "./delivery/delivery.module";
import { AppConfigModule } from "./app-config/app-config.module";

@Module({
  imports: [
    PrismaModule,
    ContentModule,
    MediaModule,
    PaymentsModule,
    RetailCrmModule,
    DeliveryModule,
    AppConfigModule
  ]
})
export class AppModule {}
