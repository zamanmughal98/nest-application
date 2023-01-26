import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SendResponse } from 'src/utils/common';
import { userServices } from '../../user/user.service';

@Injectable()
export class userValidationGuard implements CanActivate {
  constructor(private readonly userServices: userServices) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { _id: userId } = request.user;

    // checks if user is still valid
    const { data } = await this.userServices.getUserById(
      userId,
      SendResponse.USER_MIGHT_DELETED,
    );
    if (data) return true;
  }
}
