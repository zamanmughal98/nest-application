import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Headers,
} from '@nestjs/common';
import { isString } from 'lodash';
import { authenticateToken } from 'src/utils/authentication';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';
import { userServices } from './user.service';

@Controller()
export class userController {
  constructor(private readonly userServices: userServices) {}

  @Get('/me')
  getCrrentUser(@Headers('authorization') bearerToken: string) {
    return this.userServices.getCrrentUser(authenticateToken(bearerToken));
  }

  @Get()
  getUser(@Query('page') page: string) {
    return this.userServices.getUser(page);
  }

  @Get('/:userId')
  getUserById(@Param('userId') userId: string) {
    if (validator.isEmpty(userId) || !isString(userId))
      return SendResponse.INVALID_USER_ID;

    return this.userServices.getUserById(userId);
  }

  @Put('/:userId')
  updateUser(
    @Param('userId') userId: string,

    @Body('name') name: string,
    @Body('address') address: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (validator.isEmpty(userId) || !isString(userId))
      return SendResponse.INVALID_USER_ID;

    if (validator.isEmpty(name) || !isString(name))
      return SendResponse.INVALID_USER_NAME;

    if (validator.isEmpty(address) || !isString(address))
      return SendResponse.INVALID_USER_ADDRESS;

    if (validator.isEmpty(oldPassword) || !isString(oldPassword))
      return SendResponse.INVALID_USER_OLD_PASSWORD;

    if (validator.isEmpty(newPassword) || !isString(newPassword))
      return SendResponse.INVALID_USER_NEW_PASSWORD;

    return this.userServices.updateUser(userId, {
      name,
      address,
      oldPassword,
      newPassword,
    });
  }

  @Delete('/:userId')
  deleteUser(
    @Param('userId') userId: string,
    @Body('password') password: string,
  ) {
    if (validator.isEmpty(password) || !isString(password))
      return SendResponse.INVALID_USER_PASSWORD;

    if (validator.isEmpty(userId) || !isString(userId))
      return SendResponse.INVALID_USER_ID;

    return this.userServices.deleteUser(userId, password);
  }
}
