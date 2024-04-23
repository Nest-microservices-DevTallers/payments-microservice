import { Type } from 'class-transformer';
import {
  ValidateNested,
  ArrayMinSize,
  IsPositive,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator';

export class PaymentSessionDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @Type(() => PaymentSessionItemDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  items: [];
}

export class PaymentSessionItemDto {
  @IsString()
  name: string;

  @IsPositive()
  @IsNumber()
  price: number;

  @IsPositive()
  @IsNumber()
  quantity: number;
}
