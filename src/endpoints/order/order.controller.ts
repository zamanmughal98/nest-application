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
  Request,
  UseGuards,
} from '@nestjs/common';
import { jwtAuthGuard } from 'src/lib/jwt.guard';
import { userServices } from 'src/endpoints/user/user.service';
import { SendResponse } from 'src/utils/common';
import { orderServices } from './order.service';
import { pageNoDto } from 'src/dto/common.dto';
import { orderIdDto, postOrderDto } from 'src/dto/order.dto';

@Controller('/orders')
export class orderController {
  constructor(
    private readonly orderService: orderServices,
    private readonly userService: userServices,
  ) {}

  @UseGuards(jwtAuthGuard)
  @Get('/')
  getOrder(@Query() pageNo: pageNoDto): Promise<IOrderPaginationData> {
    const { page } = pageNo;
    return this.orderService.getOrder(page);
  }

  @UseGuards(jwtAuthGuard)
  @Get('/:orderId')
  getOrderById(@Param() paramOrderID: orderIdDto): Promise<IPostOrderData> {
    const { orderId } = paramOrderID;
    return this.orderService.getOrderById(orderId);
  }

  @UseGuards(jwtAuthGuard)
  @Post('/')
  async createOrder(
    @Body() postOrder: postOrderDto,
    @Request() request: ICrrentUser,
  ): Promise<IPostOrderData> {
    const { _id: userId } = request.user;
    const { product: orderingProduct } = postOrder;
    const { data } = (await this.userService.getUserById(
      userId,
    )) as ICurrentUserData;
    if (!data._id)
      throw new HttpException(
        SendResponse.USER_MIGHT_DELETED,
        HttpStatus.FORBIDDEN,
      );

    return this.orderService.createOrder(orderingProduct, userId);
  }

  @UseGuards(jwtAuthGuard)
  @Put('/:orderId')
  updateOrder(@Param() paramOrderID: orderIdDto): Promise<IPostOrderData> {
    const { orderId } = paramOrderID;
    return this.orderService.updateOrder(orderId);
  }

  @UseGuards(jwtAuthGuard)
  @Delete('/:orderId')
  deleteOrder(@Param() paramOrderID: orderIdDto): Promise<IMessage> {
    const { orderId } = paramOrderID;
    return this.orderService.deleteOrder(orderId);
  }
}
