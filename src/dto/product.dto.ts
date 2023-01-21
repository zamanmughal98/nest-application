import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

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
