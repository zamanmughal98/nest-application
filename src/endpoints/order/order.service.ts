import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { productServices } from 'src/endpoints/product/product.service';

import {
  createTimeStamp,
  DatabaseNames,
  OrderStatus,
  SendResponse,
} from 'src/utils/common';

@Injectable()
export class orderServices {
  constructor(
    @InjectModel(DatabaseNames.ORDERS)
    private readonly orderModel: Model<IOrder>,
    private productServices: productServices,
  ) {}

  async getOrder(page: string): Promise<IOrderPaginationData> {
    const recordPerPage = 2;
    const pageNo: number = parseInt(page, 10) || 1;
    const skipRecords: number = recordPerPage * (pageNo - 1);

    const maxPages: number = Math.ceil(
      (await this.orderModel.countDocuments({ deletedAt: '' })) / recordPerPage,
    );
    if (maxPages === 0)
      throw new NotFoundException(SendResponse.ORDER_NOT_FOUND);

    if (pageNo <= maxPages) {
      const paginationRecords: IOrder[] = await this.orderModel
        .find({ deletedAt: '' })
        .skip(skipRecords)
        .limit(recordPerPage);

      return { data: paginationRecords };
    } else throw new BadRequestException(SendResponse.PAGE_LIMIT_ERROR);
  }

  async getOrderById(orderId: string): Promise<IPostOrderData> {
    const order: IOrder = await this.orderModel.findById({
      _id: new ObjectId(orderId),
    });

    if (order && order.deletedAt === '') {
      return { data: order };
    } else throw new NotFoundException(SendResponse.ORDER_NOT_FOUND);
  }
  async calculateProductsPrice(
    data: IProductsArray[],
  ): Promise<IProductMapping[]> {
    const productIdArray: string[] = data.map(({ id }) => id);

    const products: IProduct[] = await this.productServices.getManyProducts(
      productIdArray,
    );

    return data
      .map((item) => {
        const id = new ObjectId(item.id);

        const productDetails: IProduct = products.find(({ _id: PID }) =>
          PID.equals(id),
        );
        if (productDetails) {
          return {
            productId: id,
            name: productDetails.name,
            price: productDetails.price,
            quantity: item.quantity,
            totalPrice: productDetails.price * item.quantity,
          };
        }
        return undefined;
      })
      .filter((item) => item !== undefined);
  }

  async createOrder(
    orderingProduct: IProductsArray[],
    userId: ObjectId,
  ): Promise<IPostOrderData> {
    const productsMapping: IProductMapping[] =
      await this.calculateProductsPrice(orderingProduct);

    if (productsMapping && productsMapping.length !== 0) {
      const grandTotal = productsMapping.reduce(
        (accumulator: number, { totalPrice }) => accumulator + totalPrice,
        0,
      );

      const dataToWrite = {
        User: {
          userId: new ObjectId(userId),
        },
        Products: productsMapping,
        grandTotal,
        status: OrderStatus.PENDING,
        createdAt: createTimeStamp(),
        updatedAt: '',
        deletedAt: '',
      };

      const newOrder: IOrderSchema = await this.orderModel.create(dataToWrite);

      return { data: newOrder };
    } else throw new NotFoundException(SendResponse.PRODUCT_NOT_FOUND);
  }

  async updateOrder(orderId: string): Promise<IPostOrderData> {
    const order: IOrder = await this.orderModel.findById(orderId);

    if (order && order.deletedAt === '') {
      order.status = OrderStatus.SHIPPED;
      order.updatedAt = createTimeStamp();

      await this.orderModel.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: order },
      );
      return { data: await this.orderModel.findById(orderId) };
    } else throw new NotFoundException(SendResponse.ORDER_NOT_FOUND);
  }

  async deleteOrder(orderId: string): Promise<IMessage> {
    const order: IOrder = await this.orderModel.findById(orderId);

    if (order && order.deletedAt === '') {
      order.deletedAt = createTimeStamp();
      order.status = OrderStatus.COMPLETED;

      await this.orderModel.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: order },
      );

      return { message: SendResponse.ORDER_DELETED };
    } else throw new NotFoundException(SendResponse.ORDER_NOT_FOUND);
  }
}
