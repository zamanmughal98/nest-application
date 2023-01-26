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
import { jwtAuthGuard } from 'src/endpoints/auth/guards/jwt.guard';
import { userServices } from './user.service';

@Controller('')
export class userController {
  constructor(private readonly userServices: userServices) {}

  @UseGuards(jwtAuthGuard)
  @Get('/me')
  getCrrentUser(@Request() request: ICurrentUser): Promise<ICurrentUserData> {
    const { _id: userId } = request.user;

    return this.userServices.getUserById(userId);
  }

  @UseGuards(jwtAuthGuard)
  @Get('/')
  getUser(@Query() pageNo: pageNoDto): Promise<IUsersPaginationData> {
    const { page } = pageNo;

    return this.userServices.getUser(page);
  }

  @UseGuards(jwtAuthGuard)
  @Get('/:userId')
  getUserById(@Param() user: userIdDto): Promise<ICurrentUserData> {
    const { userId } = user;

    return this.userServices.getUserById(userId);
  }

  @UseGuards(jwtAuthGuard)
  @Put('/:userId')
  updateUser(
    @Param() user: userIdDto,
    @Body() updateUser: updateUserDto,
  ): Promise<ICurrentUserData> {
    const { userId } = user;

    return this.userServices.updateUser(userId, updateUser);
  }

  @UseGuards(jwtAuthGuard)
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
