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
import { isNumber, isString } from 'lodash';
import { JwtAuthGuard } from 'src/lib/jwt.guard';
import { userServices } from 'src/user/user.service';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';
import { orderServices } from './order.service';

@Controller('/orders')
export class orderController {
  constructor(
    private readonly orderService: orderServices,
    private readonly userService: userServices,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getOrder(@Query('page') page: string) {
    return this.orderService.getOrder(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:orderId')
  getOrderById(@Param('orderId') orderId: string) {
    if (validator.isEmpty(orderId))
      throw new HttpException(
        SendResponse.INVALID_ORDER_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.orderService.getOrderById(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createOrder(@Body() body: IPostOrder, @Request() request: ICrrentUser) {
    const { _id: userId, email } = request.user;
    const { product: orderingProduct } = body;
    const requestedUser = (await this.userService.getUserById(userId)) as IUser;

    if (!requestedUser._id)
      throw new HttpException(
        SendResponse.USER_MIGHT_DELETED,
        HttpStatus.FORBIDDEN,
      );

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
    return this.orderService.createOrder(orderingProduct, { userId, email });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:orderId')
  updateOrder(@Param('orderId') orderId: string) {
    if (validator.isEmpty(orderId))
      throw new HttpException(
        SendResponse.INVALID_ORDER_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.orderService.updateOrder(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:orderId')
  deleteOrder(@Param('orderId') orderId: string) {
    if (validator.isEmpty(orderId))
      throw new HttpException(
        SendResponse.INVALID_ORDER_ID,
        HttpStatus.FORBIDDEN,
      );
    return this.orderService.deleteOrder(orderId);
  }
}
