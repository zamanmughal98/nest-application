import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  authenticatePassword,
  createAccessToken,
  hashPassword,
} from 'src/utils/authentication';
import { createTimeStamp, DatabaseNames, SendResponse } from 'src/utils/common';

@Injectable()
export class authServices {
  constructor(
    @InjectModel(DatabaseNames.USERS) private readonly UserModel: Model<IUser>,
  ) {}

  async userLogin(body: ILogin) {
    try {
      const { email, password } = body;

      const userExists: IUser = await this.UserModel.findOne({
        email,
        deletedAt: '',
      });

      if (userExists) {
        const { _id: UserId } = userExists;

        const checkPassword: boolean = await authenticatePassword(
          password,
          userExists.password,
        );

        if (checkPassword) {
          const accessTokenPayload = {
            _id: UserId,
            name: userExists.name,
            address: userExists.address,
            email: userExists.email,
            createdAt: userExists.createdAt,
            updatedAt: userExists.updatedAt,
            deletedAt: userExists.deletedAt,
          };

          const accessToken: string = createAccessToken(accessTokenPayload);

          return { accessToken };
        } else return { message: SendResponse.WRONG_PASSWORD };
      } else return { message: SendResponse.USER_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async userSignup(body: ISignup) {
    try {
      const { name, address, email, password } = body;

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

        return newUser;
      } else return { message: SendResponse.USER_ALREADY_EXIST };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
