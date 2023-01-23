import { Injectable } from '@nestjs/common';
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
    @InjectModel(DatabaseNames.USERS) private readonly UserModel: Model<IUser>,
  ) {}

  async userLogin(login: loginDto): Promise<ILoginData> {
    try {
      const { email, password } = login;

      const userExists: IUser = await this.UserModel.findOne({
        email,
        deletedAt: '',
      });

      if (userExists) {
        const { _id: UserId } = userExists;

        const passwordMatch: boolean = await authenticatePassword(
          password,
          userExists.password,
        );

        if (passwordMatch) {
          const accessTokenPayload = {
            _id: UserId,
            name: userExists.name,
            address: userExists.address,
            email: userExists.email,
            createdAt: userExists.createdAt,
            updatedAt: userExists.updatedAt,
            deletedAt: userExists.deletedAt,
          };

          const accessToken: string = this.jwtService.sign(accessTokenPayload, {
            expiresIn: '1h',
          });
          return { accessToken };
        } else return { message: SendResponse.WRONG_PASSWORD };
      } else return { message: SendResponse.USER_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async userSignup(signup: signupDto): Promise<ISignupData> {
    try {
      const { name, address, email, password } = signup;

      const userExists: IUser = await this.UserModel.findOne({ email });
      if (!userExists) {
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
        const newUser: IUserSchmema = await this.UserModel.create(dataToWrite);

        return { data: newUser };
      } else return { message: SendResponse.USER_ALREADY_EXIST };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
