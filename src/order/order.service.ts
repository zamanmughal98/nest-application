import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
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
    private readonly OrderModel: Model<IOrder>,
  ) {}

  async getOrder(page: string) {
    try {
      // Pagination
      const recordPerPage = 2;
      const pageNo: number = parseInt(page, 10) || 1;
      const skipRecords: number = recordPerPage * (pageNo - 1);
      const maxPages: number = Math.ceil(
        (await this.OrderModel.countDocuments({ deletedAt: '' })) /
          recordPerPage,
      );

      if (pageNo <= maxPages) {
        const allOrders: IOrder[] = await this.OrderModel.find({
          deletedAt: '',
        });

        const paginationRecords: IOrder[] = allOrders.slice(
          skipRecords,
          skipRecords + recordPerPage,
        );

        if (allOrders && paginationRecords)
          return {
            Pagination: paginationRecords,
            Orders: allOrders,
          };
        else return { message: SendResponse.PRODUCT_NOT_FOUND };
      } else return { message: SendResponse.PAGE_LIMIT_ERROR };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getOrderById(orderId: string) {
    try {
      const orderExists: IOrder = await this.OrderModel.findById({
        _id: new ObjectId(orderId),
      });

      if (orderExists && orderExists.deletedAt === '') {
        return orderExists;
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async createOrder(orderingProduct: ProductsArray[]) {
    try {
      return orderingProduct;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async updateOrder(orderId: string) {
    try {
      const orderExists: IOrder = await this.OrderModel.findById(orderId);

      if (orderExists && orderExists.deletedAt === '') {
        orderExists.status = OrderStatus.SHIPPED;
        orderExists.updatedAt = createTimeStamp();

        await this.OrderModel.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: orderExists },
        );
        return await this.OrderModel.findById(orderId);
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deleteOrder(orderId: string) {
    try {
      const orderExists: IOrder = await this.OrderModel.findById(orderId);

      if (orderExists && orderExists.deletedAt === '') {
        orderExists.deletedAt = createTimeStamp();
        orderExists.status = OrderStatus.COMPLETED;

        await this.OrderModel.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: orderExists },
        );

        return { message: SendResponse.ORDER_DELETED };
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
