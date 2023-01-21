import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class productsArrayDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  quantity: number;
}
export class postOrderDto {
  @ValidateNested({ each: true })
  @Type(() => productsArrayDto)
  product: productsArrayDto[];
}
export class paramOrderIDDto {
  @IsString()
  orderId: string;
}
