import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { pageNoDto } from 'src/dto/common.dto';
import { updateUserDto, deleteUserDto, userIdDto } from 'src/dto/user.dto';
import { JwtAuthGuard } from 'src/lib/jwt.guard';
import { userServices } from './user.service';

@Controller('')
export class userController {
  constructor(private readonly userServices: userServices) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getCrrentUser(@Request() request: ICrrentUser): Promise<ICurrentUserData> {
    const { _id: userId } = request.user;
    return this.userServices.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getUser(@Query() pageNo: pageNoDto): Promise<IUsersPaginationData> {
    const { page } = pageNo;
    return this.userServices.getUser(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  getUserById(@Param() user: userIdDto): Promise<ICurrentUserData> {
    const { userId } = user;
    return this.userServices.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId')
  updateUser(
    @Param() user: userIdDto,
    @Body() updateUser: updateUserDto,
  ): Promise<ICurrentUserData> {
    const { userId } = user;
    return this.userServices.updateUser(userId, updateUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  deleteUser(
    @Param() user: userIdDto,
    @Body() deleteUser: deleteUserDto,
  ): Promise<IMessage> {
    const { userId } = user;
    const { password } = deleteUser;

    return this.userServices.deleteUser(userId, password);
  }
}
