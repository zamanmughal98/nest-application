import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { userServices } from 'src/endpoints/user/user.service';
import { SendResponse } from 'src/utils/common';

@Injectable()
export class userValidater implements NestMiddleware {
  constructor(private readonly userService: userServices) {}

  use(request: ICurrentUser, response, next: NextFunction) {
    console.log('User Middleware Called  ...\n');

    // const { _id: userId } = request.user;

    // const { data } = (await this.userService.getUserById(
    //   '63d0baa43e7a086671fad9cd',
    // )) as ICurrentUserData;

    // if (!data)
    //   throw new HttpException(
    //     SendResponse.USER_MIGHT_DELETED,
    //     HttpStatus.FORBIDDEN,
    //   );

    next();
  }
}
