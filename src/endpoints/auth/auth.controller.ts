import { Body, Controller, Post } from '@nestjs/common';
import { loginDto, signupDto } from 'src/dto/auth.dto';
import { authServices } from './auth.service';

@Controller()
export class authController {
  constructor(private readonly authServices: authServices) {}

  @Post('/login')
  userLogin(@Body() login: loginDto): Promise<ILoginData> {
    return this.authServices.userLogin(login);
  }

  @Post('/signup')
  userSignup(@Body() signup: signupDto): Promise<ISignupData> {
    return this.authServices.userSignup(signup);
  }
}
