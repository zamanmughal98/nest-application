import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDto, signupDto } from 'src/dto/auth.dto';
import {
  authenticatePassword,
  hashPassword,
} from 'src/endpoints/auth/guards/authentication';
import { createTimeStamp, SendResponse } from 'src/utils/common';
import { userServices } from '../user/user.service';

@Injectable()
export class authServices {
  constructor(
    private jwtService: JwtService,
    private readonly userServices: userServices,
  ) {}

  async userLogin(login: loginDto): Promise<ILoginData> {
    const { email, password } = login;

    const user: IUser = await this.userServices.getUserByEmail(email);

    if (user && user.deletedAt === '') {
      const { _id: UserId } = user;

      const passwordMatch: boolean = await authenticatePassword(
        password,
        user.password,
      );

      if (passwordMatch) {
        const accessTokenPayload = {
          _id: UserId,
          name: user.name,
          address: user.address,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        };

        const accessToken: string = this.jwtService.sign(accessTokenPayload, {
          expiresIn: '5h',
        });
        return { accessToken };
      } else throw new UnauthorizedException(SendResponse.WRONG_PASSWORD);
    } else throw new NotFoundException(SendResponse.USER_NOT_FOUND);
  }

  async userSignup(signup: signupDto): Promise<ISignupData> {
    const { name, address, email, password } = signup;

    const user: IUser = await this.userServices.getUserByEmail(email);
    if (!user) {
      const hashedPassword: string = await hashPassword(password);

      const dataToWrite: IUserSchmema = {
        name,
        address,
        email,
        password: hashedPassword,
        createdAt: createTimeStamp(),
        updatedAt: '',
        deletedAt: '',
      };
      const newUser: IUserSchmema = await this.userServices.createUser(
        dataToWrite,
      );

      return { data: newUser };
    } else throw new ConflictException(SendResponse.USER_ALREADY_EXIST);
  }
}
