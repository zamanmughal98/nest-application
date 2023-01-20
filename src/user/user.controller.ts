import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { isString } from 'lodash';
import { JwtAuthGuard } from 'src/lib/jwt.guard';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';
import { userServices } from './user.service';

@Controller('')
export class userController {
  constructor(private readonly userServices: userServices) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getCrrentUser(@Request() request: ICrrentUser) {
    const { _id: userId } = request.user;
    return this.userServices.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getUser(@Query('page') page: string) {
    return this.userServices.getUser(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getUserById(@Param('userId') userId: string) {
    if (validator.isEmpty(userId) || !isString(userId))
      throw new HttpException(
        SendResponse.INVALID_USER_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.userServices.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId')
  updateUser(
    @Param('userId') userId: string,

    @Body('name') name: string,
    @Body('address') address: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (validator.isEmpty(userId) || !isString(userId))
      throw new HttpException(
        SendResponse.INVALID_USER_ID,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(name) || !isString(name))
      throw new HttpException(
        SendResponse.INVALID_USER_NAME,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(address) || !isString(address))
      throw new HttpException(
        SendResponse.INVALID_USER_ADDRESS,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(oldPassword) || !isString(oldPassword))
      throw new HttpException(
        SendResponse.INVALID_USER_OLD_PASSWORD,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(newPassword) || !isString(newPassword))
      throw new HttpException(
        SendResponse.INVALID_USER_NEW_PASSWORD,
        HttpStatus.FORBIDDEN,
      );

    return this.userServices.updateUser(userId, {
      name,
      address,
      oldPassword,
      newPassword,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  deleteUser(
    @Param('userId') userId: string,
    @Body('password') password: string,
  ) {
    if (validator.isEmpty(password) || !isString(password))
      throw new HttpException(
        SendResponse.INVALID_USER_PASSWORD,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(userId) || !isString(userId))
      throw new HttpException(
        SendResponse.INVALID_USER_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.userServices.deleteUser(userId, password);
  }
}
