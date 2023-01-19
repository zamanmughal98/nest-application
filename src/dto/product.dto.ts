import { ObjectId } from 'mongoose';
import { messageDto, validationMessageDto } from './common.dto';

export class productDto {
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id?: ObjectId;
  __v?: number;
}
export class productSchemaDto {
  name: string;
  price: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export class paramProductIDDto {
  productId: string;
}
export class postProductDataDto extends validationMessageDto {
  data?: productSchemaDto;
}
export class getProductsDataDto extends messageDto {
  data?: { Pagination?: productDto[]; Products?: productDto[] };
}

export class getProductsDto {
  page: string;
}

export class postProductDto {
  name: string;
  description: string;
  productNo: string;
  price: string | number;
}
export class updateProductDto {
  name: string;
  description: string;
  price: number;
}
