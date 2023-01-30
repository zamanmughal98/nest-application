import { Injectable } from '@nestjs/common';

@Injectable()
export class orderServices {
  constructor() {}

  async getOrder(page: string) {
    const recordPerPage = 2;
    const pageNo: number = parseInt(page, 10) || 1;
    const skipRecords: number = recordPerPage * (pageNo - 1);

    return { pageNo, skipRecords };
  }

  async getOrderById(orderId: string) {
    return { orderId };
  }

  async createOrder(orderingProduct: IProductsArray[], userId: string) {
    return { orderingProduct, userId };
  }

  async updateOrder(orderId: string) {
    return { orderId };
  }

  async deleteOrder(orderId: string) {
    return { orderId };
  }
}
