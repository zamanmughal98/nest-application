import {
  Injectable,
} from '@nestjs/common';
import { loginDto, signupDto } from 'src/dto/auth.dto';

@Injectable()
export class authServices {
  constructor(
  ) {}

  async userLogin(login: loginDto) {
    return login;
  }

  async userSignup(signup: signupDto) {
    return signup;
  }
}
