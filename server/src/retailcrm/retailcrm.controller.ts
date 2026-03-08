import { Body, Controller, Post } from "@nestjs/common";
import { CreateRetailCrmOrderDto } from "./dto/create-order.dto";
import { RetailCrmService } from "./retailcrm.service";

@Controller("public/retailcrm")
export class RetailCrmController {
  constructor(private readonly retailCrmService: RetailCrmService) {}

  @Post("create-order")
  async createOrder(@Body() dto: CreateRetailCrmOrderDto) {
    return this.retailCrmService.createOrder(dto);
  }
}
