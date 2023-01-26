import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SendResponse } from 'src/utils/common';
import { userServices } from '../../user/user.service';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userServices: userServices) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }
  async validate(payload: IPayload) {
    if (!payload && !payload._id) throw new UnauthorizedException();

    // checks if user is still valid
    const { data } = await this.userServices.getUserById(
      payload._id,
      SendResponse.USER_MIGHT_DELETED,
    );
    return data;
  }
}
