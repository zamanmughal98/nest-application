import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { loginDto, signupDto } from 'src/dto/auth.dto';
import { authenticatePassword, hashPassword } from 'src/utils/authentication';
import { createTimeStamp, DatabaseNames, SendResponse } from 'src/utils/common';

@Injectable()
export class authServices {
  constructor(
    private jwtService: JwtService,
    @InjectModel(DatabaseNames.USERS) private readonly userModel: Model<IUser>,
  ) {}

  async userLogin(login: loginDto): Promise<ILoginData> {
    const { email, password } = login;

    const user: IUser = await this.userModel.findOne({
      email,
      deletedAt: '',
    });

    if (user) {
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

    const user: IUser = await this.userModel.findOne({ email });
    if (!user) {
      const hashedPassword: string = await hashPassword(password);

      const dataToWrite = {
        name,
        address,
        email,
        password: hashedPassword,
        createdAt: createTimeStamp(),
        updatedAt: '',
        deletedAt: '',
      };
      const newUser: IUserSchmema = await this.userModel.create(dataToWrite);

      return { data: newUser };
    } else throw new ConflictException(SendResponse.USER_ALREADY_EXIST);
  }
}
