interface IProduct {
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id?: ObjectId;
  __v?: number;
}
interface IProductSchema {
  name: string;
  price: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

interface IPostProductData extends IMessage {
  data?: IProductSchema;
}
interface IProductPaginationData extends IMessage {
  data?: IProduct[];
}
