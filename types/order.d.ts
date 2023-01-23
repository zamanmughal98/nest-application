interface IProductMapping {
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
interface IUserMapping {
  userId: ObjectId | string;
  email: string;
}

interface IOrder {
  User: IUserMapping[];
  Products: IProductMapping[];
  grandTotal: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id?: ObjectId;
  __v?: number;
}

interface IOrderSchema {
  User: IUserMapping[];
  Products: IProductMapping[];
  grandTotal: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
interface IPostOrderData extends IMessage {
  data?: IOrderSchema;
}

interface IOrderPaginationData extends IMessage {
  data?: IOrder[];
}

interface ProductsArray {
  id: string;
  quantity: number;
}
