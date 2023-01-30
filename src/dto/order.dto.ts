import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SendResponse } from 'src/utils/common';

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
export class orderIdDto {
  @Length(24, 24, { message: SendResponse.INVALID_ID_LENGTH })
  orderId: string;
}
