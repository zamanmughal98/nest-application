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
import { JwtAuthGuard } from 'src/lib/jwt.guard';
import { userServices } from 'src/endpoints/user/user.service';
import { SendResponse } from 'src/utils/common';
import { orderServices } from './order.service';
import { pageNoDto } from 'src/dto/common.dto';
import { paramOrderIDDto, postOrderDto } from 'src/dto/order.dto';

@Controller('/orders')
export class orderController {
  constructor(
    private readonly orderService: orderServices,
    private readonly userService: userServices,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getOrder(@Query() pageNo: pageNoDto) {
    const { page } = pageNo;
    return this.orderService.getOrder(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:orderId')
  getOrderById(@Param() paramOrderID: paramOrderIDDto) {
    const { orderId } = paramOrderID;
    return this.orderService.getOrderById(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createOrder(
    @Body() postOrder: postOrderDto,
    @Request() request: ICrrentUser,
  ) {
    const { _id: userId, email } = request.user;
    const { product: orderingProduct } = postOrder;
    const requestedUser = (await this.userService.getUserById(userId)) as IUser;

    if (!requestedUser._id)
      throw new HttpException(
        SendResponse.USER_MIGHT_DELETED,
        HttpStatus.FORBIDDEN,
      );

    return this.orderService.createOrder(orderingProduct, { userId, email });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:orderId')
  updateOrder(@Param() paramOrderID: paramOrderIDDto) {
    const { orderId } = paramOrderID;
    return this.orderService.updateOrder(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:orderId')
  deleteOrder(@Param() paramOrderID: paramOrderIDDto) {
    const { orderId } = paramOrderID;
    return this.orderService.deleteOrder(orderId);
  }
}
