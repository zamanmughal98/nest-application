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

interface IParamProductID {
  productId: string;
}
interface IPostProductData extends IValidationMessage {
  data?: IProductSchema;
}
interface IGetProductsData extends IMessage {
  data?: { Pagination?: IProduct[]; Products?: IProduct[] };
}

interface IGetProducts {
  page: string;
}

interface IPostProduct {
  name: string;
  description: string;
  productNo: string;
  price: string | number;
}
interface IUpdateProduct {
  name: string;
  description: string;
  price: number;
}
