import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { productServices } from 'src/endpoints/product/product.service';
import { orderDocument } from 'src/schemas/order.schema';

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
    private readonly orderModel: Model<orderDocument>,
    private productServices: productServices,
  ) {}

  async getOrder(page: string) {
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
        const orders = await this.orderModel.find({
          deletedAt: '',
        });

        const paginationRecords = orders.slice(
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

  async getOrderById(orderId: string) {
    try {
      const order = await this.orderModel.findById({
        _id: new ObjectId(orderId),
      });

      if (order && order.deletedAt === '') {
        return { data: order };
      } else return { message: SendResponse.ORDER_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async calculateProductsPrice(data: IProductsArray[]) {
    const productIdArray: string[] = data.map(({ id }) => id);

    const products = await this.productServices.getManyProducts(productIdArray);

    return data
      .map((item) => {
        const id = new ObjectId(item.id);

        const productDetails = products.find(({ _id: PID }) => PID.equals(id));
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
    { userId, email }: IUserMapping,
  ) {
    try {
      const productsMapping = await this.calculateProductsPrice(
        orderingProduct,
      );

      if (productsMapping && productsMapping.length !== 0) {
        const grandTotal = productsMapping.reduce(
          (accumulator: number, { totalPrice }) => accumulator + totalPrice,
          0,
        );

        const dataToWrite = {
          User: {
            userId: new ObjectId(userId),
            email,
          },
          Products: productsMapping,
          grandTotal,
          status: OrderStatus.PENDING,
          createdAt: createTimeStamp(),
          updatedAt: '',
          deletedAt: '',
        };

        const newOrder = await this.orderModel.create(dataToWrite);

        return { data: newOrder };
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async updateOrder(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

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

  async deleteOrder(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

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
