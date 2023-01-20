import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { productServices } from 'src/endpoints/product/product.service';
import { userServices } from 'src/endpoints/user/user.service';

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
    private userservices: userServices,
    private productservices: productServices,
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
  calculateProductsPrice = async (data: ProductsArray[]) => {
    const { Products: allproducts } = await this.productservices.getProduct(
      '0',
    );

    return data
      .map((item) => {
        const id = new ObjectId(item.id);

        const productDetails: IProduct = allproducts.find(({ _id: PID }) =>
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
  };

  async createOrder(
    orderingProduct: ProductsArray[],
    { userId, email }: { userId: string; email: string },
  ) {
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
            email,
          },
          Products: productsMapping,
          grandTotal,
          status: OrderStatus.PENDING,
          createdAt: createTimeStamp(),
          updatedAt: '',
          deletedAt: '',
        };

        const newOrder: IOrderSchema = await this.OrderModel.create(
          dataToWrite,
        );

        return newOrder;
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
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
