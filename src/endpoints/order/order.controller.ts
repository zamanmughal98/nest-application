import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { orderServices } from './order.service';
import { pageNoDto } from 'src/dto/common.dto';
import { orderIdDto, postOrderDto } from 'src/dto/order.dto';

@Controller('/orders')
export class orderController {
  constructor(private readonly orderServices: orderServices) {}

  @Get('/')
  getOrder(@Query() pageNo: pageNoDto) {
    const { page } = pageNo;

    return this.orderServices.getOrder(page);
  }

  @Get('/:orderId')
  getOrderById(@Param() paramOrderID: orderIdDto) {
    const { orderId } = paramOrderID;

    return this.orderServices.getOrderById(orderId);
  }

  @Post('/')
  async createOrder(
    @Body() postOrder: postOrderDto,
    @Request() request: ICurrentUser,
  ) {
    const { product: orderingProduct } = postOrder;

    return this.orderServices.createOrder(orderingProduct, 'userId');
  }

  @Put('/:orderId')
  updateOrder(@Param() paramOrderID: orderIdDto) {
    const { orderId } = paramOrderID;

    return this.orderServices.updateOrder(orderId);
  }

  @Delete('/:orderId')
  deleteOrder(@Param() paramOrderID: orderIdDto) {
    const { orderId } = paramOrderID;

    return this.orderServices.deleteOrder(orderId);
  }
}
