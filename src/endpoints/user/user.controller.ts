import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { pageNoDto } from 'src/dto/common.dto';
import { updateUserDto, deleteUserDto, userIdDto } from 'src/dto/user.dto';
import { userServices } from './user.service';

@Controller('')
export class userController {
  constructor(private readonly userServices: userServices) {}

  @Get('/me')
  getCrrentUser(@Request() request: ICurrentUser) {
    return this.userServices.getUserById('userId');
  }

  @Get('/')
  getUser(@Query() pageNo: pageNoDto) {
    const { page } = pageNo;

    return this.userServices.getUser(page);
  }

  @Get('/:userId')
  getUserById(@Param() user: userIdDto) {
    const { userId } = user;

    return this.userServices.getUserById(userId);
  }

  @Put('/:userId')
  updateUser(@Param() user: userIdDto, @Body() updateUser: updateUserDto) {
    const { userId } = user;

    return this.userServices.updateUser(userId, updateUser);
  }

  @Delete('/:userId')
  deleteUser(@Param() user: userIdDto, @Body() deleteUser: deleteUserDto) {
    const { userId } = user;
    const { password } = deleteUser;

    return this.userServices.deleteUser(userId, password);
  }
}
