import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authServices } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: authServices) {
    super();
  }

  async validate(body: ILogin): Promise<any> {
    const user = await this.authService.userLogin(body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
