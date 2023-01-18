import { Body, Controller, Post } from '@nestjs/common';

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
      return SendResponse.INVALID_USER_EMAIL;

    if (validator.isEmpty(password) || !isString(password))
      return SendResponse.INVALID_USER_PASSWORD;

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
      return SendResponse.INVALID_USER_NAME;

    if (validator.isEmpty(address) || !isString(address))
      return SendResponse.INVALID_USER_ADDRESS;

    if (
      validator.isEmpty(email) ||
      !isString(email) ||
      !validator.isEmail(email)
    )
      return SendResponse.INVALID_USER_EMAIL;

    if (validator.isEmpty(password) || !isString(password))
      return SendResponse.INVALID_USER_PASSWORD;

    return this.authServices.userSignup({ name, address, email, password });
  }
}
