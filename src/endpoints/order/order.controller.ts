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
  UseGuards,
} from '@nestjs/common';
import { jwtAuthGuard } from 'src/endpoints/auth/guards/jwt.guard';
import { orderServices } from './order.service';
import { pageNoDto } from 'src/dto/common.dto';
import { orderIdDto, postOrderDto } from 'src/dto/order.dto';

@Controller('/orders')
export class orderController {
  constructor(private readonly orderServices: orderServices) {}

  @UseGuards(jwtAuthGuard)
  @Get('/')
  getOrder(@Query() pageNo: pageNoDto): Promise<IOrderPaginationData> {
    const { page } = pageNo;

    return this.orderServices.getOrder(page);
  }

  @UseGuards(jwtAuthGuard)
  @Get('/:orderId')
  getOrderById(@Param() paramOrderID: orderIdDto): Promise<IPostOrderData> {
    const { orderId } = paramOrderID;

    return this.orderServices.getOrderById(orderId);
  }

  @UseGuards(jwtAuthGuard)
  @Post('/')
  async createOrder(
    @Body() postOrder: postOrderDto,
    @Request() request: ICurrentUser,
  ): Promise<IPostOrderData> {
    const { _id: userId } = request.user;
    const { product: orderingProduct } = postOrder;

    return this.orderServices.createOrder(orderingProduct, userId);
  }

  @UseGuards(jwtAuthGuard)
  @Put('/:orderId')
  updateOrder(@Param() paramOrderID: orderIdDto): Promise<IPostOrderData> {
    const { orderId } = paramOrderID;

    return this.orderServices.updateOrder(orderId);
  }

  @UseGuards(jwtAuthGuard)
  @Delete('/:orderId')
  deleteOrder(@Param() paramOrderID: orderIdDto): Promise<IMessage> {
    const { orderId } = paramOrderID;

    return this.orderServices.deleteOrder(orderId);
  }
}
