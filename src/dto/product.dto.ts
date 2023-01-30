import { IsNotEmpty, IsString, IsNumber, Min, Length } from 'class-validator';
import { SendResponse } from 'src/utils/common';

export class productIdDto {
  @Length(24, 24, { message: SendResponse.INVALID_ID_LENGTH })
  productId: string;
}

export class postProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  productNo: string;

  @IsNumber()
  @Min(10)
  price: number;
}
export class updateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(10)
  price: number;
}
