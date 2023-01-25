import { HttpException, Injectable } from '@nestjs/common';
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
    try {
      // Pagination
      const recordPerPage = 2;
      const pageNo: number = parseInt(page, 10) || 1;
      const skipRecords: number = recordPerPage * (pageNo - 1);
      const maxPages: number = Math.ceil(
        (await this.orderModel.countDocuments({ deletedAt: '' })) /
          recordPerPage,
      );

      if (pageNo <= maxPages) {
        const orders: IOrder[] = await this.orderModel.find({
          deletedAt: '',
        });

        const paginationRecords: IOrder[] = orders.slice(
          skipRecords,
          skipRecords + recordPerPage,
        );

        if (paginationRecords) return { data: paginationRecords };
        else return { message: SendResponse.PRODUCT_NOT_FOUND };
      } else return { message: SendResponse.PAGE_LIMIT_ERROR };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getOrderById(orderId: string): Promise<IPostOrderData> {
    try {
      const order: IOrder = await this.orderModel.findById({
        _id: new ObjectId(orderId),
      });

      if (order && order.deletedAt === '') {
        return { data: order };
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
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
    try {
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

        const newOrder: IOrderSchema = await this.orderModel.create(
          dataToWrite,
        );

        return { data: newOrder };
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async updateOrder(orderId: string): Promise<IPostOrderData> {
    try {
      const order: IOrder = await this.orderModel.findById(orderId);

      if (order && order.deletedAt === '') {
        order.status = OrderStatus.SHIPPED;
        order.updatedAt = createTimeStamp();

        await this.orderModel.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: order },
        );
        return { data: await this.orderModel.findById(orderId) };
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deleteOrder(orderId: string): Promise<IMessage> {
    try {
      const order: IOrder = await this.orderModel.findById(orderId);

      if (order && order.deletedAt === '') {
        order.deletedAt = createTimeStamp();
        order.status = OrderStatus.COMPLETED;

        await this.orderModel.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: order },
        );

        return { message: SendResponse.ORDER_DELETED };
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
