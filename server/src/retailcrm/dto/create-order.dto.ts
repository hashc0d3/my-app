import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class RetailCrmOrderItemDto {
  @IsString()
  productName!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  initialPrice!: number;

  @IsOptional()
  @IsArray()
  properties?: Array<{ name: string; value: string }>;
}

export class CreateRetailCrmOrderDto {
  @IsString()
  orderNumber!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RetailCrmOrderItemDto)
  items!: RetailCrmOrderItemDto[];

  @IsString()
  firstName!: string;

  @IsString()
  email!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  deliveryPoint?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryPrice?: number;

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsNumber()
  @Min(0)
  totalPrice!: number;
}
