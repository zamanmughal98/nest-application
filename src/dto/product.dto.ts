import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class paramProductIDDto {
  @IsString()
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
  price: number;
}
