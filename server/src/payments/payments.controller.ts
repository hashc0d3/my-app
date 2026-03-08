import { Body, Controller, Post } from "@nestjs/common";
import { IsArray, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";
import { PaymentsService } from "./payments.service";

class CreatePaymentDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  @Length(1, 500)
  purpose!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentMode?: string[];

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  orderId?: string;
}

@Controller("public/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create")
  async create(@Body() dto: CreatePaymentDto) {
    const result = await this.paymentsService.createPayment({
      amount: dto.amount,
      purpose: dto.purpose,
      paymentMode: dto.paymentMode,
      redirectUrl: dto.redirectUrl,
      orderId: dto.orderId
    });
    return {
      success: true,
      data: {
        Data: {
          paymentLink: result.paymentLink,
          ...(result.raw as object)
        }
      }
    };
  }
}
