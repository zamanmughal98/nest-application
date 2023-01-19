import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { isString } from 'lodash';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';
import { authServices } from './auth.service';

@Controller()
export class authController {
  constructor(private readonly authServices: authServices) {}

  @Post('/login')
  userLogin(@Body('email') email: string, @Body('password') password: string) {
    if (
      validator.isEmpty(email) ||
      !isString(email) ||
      !validator.isEmail(email)
    )
      throw new HttpException(
        SendResponse.INVALID_USER_EMAIL,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(password) || !isString(password))
      throw new HttpException(
        SendResponse.INVALID_USER_PASSWORD,
        HttpStatus.FORBIDDEN,
      );

    return this.authServices.userLogin({ email, password });
  }

  @Post('/signup')
  userSignup(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
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

    if (
      validator.isEmpty(email) ||
      !isString(email) ||
      !validator.isEmail(email)
    )
      throw new HttpException(
        SendResponse.INVALID_USER_EMAIL,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(password) || !isString(password))
      throw new HttpException(
        SendResponse.INVALID_USER_PASSWORD,
        HttpStatus.FORBIDDEN,
      );

    return this.authServices.userSignup({ name, address, email, password });
  }
}
