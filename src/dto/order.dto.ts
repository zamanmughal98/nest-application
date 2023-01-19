import { ObjectId } from 'mongoose';
import { messageDto, validationMessageDto } from './common.dto';

export class productMappingDto {
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
export class userMappingDto {
  userId: ObjectId;
  email: string;
}

export class orderDto {
  User: userMappingDto[];
  Products: IProductMapping[];
  grandTotal: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id?: ObjectId;
  __v?: number;
}

export class orderSchemaDto {
  User: userMappingDto[];
  Products: productMappingDto[];
  grandTotal: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
export class postOrderDataDto extends validationMessageDto {
  data?: orderSchemaDto;
}

export class getOrdersDataDto extends messageDto {
  data?: { Pagination?: orderDto[]; Orders?: orderDto[] };
}
export class getOrdersDto {
  page: string;
}

export class productsArrayDto {
  id: string;
  quantity: number;
}

export class postOrderDto {
  product: productsArrayDto[];
}

export class paramOrderIDDto {
  orderId: string;
}
