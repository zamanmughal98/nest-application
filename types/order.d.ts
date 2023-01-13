interface IProductMapping {
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
interface IUserMapping {
  userId: ObjectId;
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
interface IPostOrderData extends IValidationMessage {
  data?: IOrderSchema;
}

interface IGetOrdersData extends IMessage {
  data?: { Pagination?: IOrder[]; Orders?: IOrder[] };
}
interface IGetOrders {
  page: string;
}

interface ProductsArray {
  id: string;
  quantity: number;
}

interface IPostOrder {
  product: ProductsArray[];
}

interface IParamOrderID {
  orderId: string;
}
