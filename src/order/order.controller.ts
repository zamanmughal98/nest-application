import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { orderServices } from './order.service';
import { isNumber, isString } from 'lodash';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';

@Controller('/orders')
export class orderController {
  constructor(private readonly orderService: orderServices) {}

  @Get()
  getProduct(@Query('page') page: string) {
    return this.orderService.getOrder(page);
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string) {
    if (validator.isEmpty(orderId))
      throw new HttpException(
        SendResponse.INVALID_ORDER_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.orderService.getOrderById(orderId);
  }

  @Post()
  createOrder(@Body() body: IPostOrder) {
    const { product: orderingProduct } = body;

    orderingProduct.forEach(({ id, quantity }, index) => {
      if (validator.isEmpty(id) || !isString(id))
        throw new HttpException(
          `${SendResponse.INVALID_PRODUCT_ID} at position ${index + 1}`,
          HttpStatus.FORBIDDEN,
        );
      if (!isNumber(quantity) || quantity < 1 || quantity > 20)
        throw new HttpException(
          SendResponse.MIN_MAX_ORDER_QUANTITY_ERROR.replace(
            'this',
            `${index + 1}`,
          ),
          HttpStatus.FORBIDDEN,
        );
    });
    return this.orderService.createOrder(orderingProduct);
  }

  @Put(':orderId')
  updateOrder(@Param('orderId') orderId: string) {
    if (validator.isEmpty(orderId))
      throw new HttpException(
        SendResponse.INVALID_ORDER_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.orderService.updateOrder(orderId);
  }

  @Delete(':orderId')
  deleteOrder(@Param('orderId') orderId: string) {
    if (validator.isEmpty(orderId))
      throw new HttpException(
        SendResponse.INVALID_ORDER_ID,
        HttpStatus.FORBIDDEN,
      );
    return this.orderService.deleteOrder(orderId);
  }
}
