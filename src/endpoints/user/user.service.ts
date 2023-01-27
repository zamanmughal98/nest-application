import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { updateUserDto } from 'src/dto/user.dto';
import {
  authenticatePassword,
  hashPassword
} from 'src/endpoints/auth/guards/authentication';
import { createTimeStamp, DatabaseNames, SendResponse } from 'src/utils/common';

@Injectable()
export class userServices {
  constructor(
    @InjectModel(DatabaseNames.USERS) private readonly userModel: Model<IUser>,
  ) {}

  async createUser(userData: IUserSchmema): Promise<IUserSchmema> {
    const newUser: IUserSchmema = await this.userModel.create(userData);
    return newUser;
  }

  async getUser(page: string): Promise<IUsersPaginationData> {
    const recordPerPage = 2;
    const pageNo: number = parseInt(page, 10) || 1;
    const skipRecords: number = recordPerPage * (pageNo - 1);

    const maxPages: number = Math.ceil(
      (await this.userModel.countDocuments({ deletedAt: '' })) / recordPerPage,
    );
    if (maxPages === 0)
      throw new NotFoundException(SendResponse.USER_NOT_FOUND);

    if (pageNo <= maxPages) {
      const paginationRecords: IUser[] = await this.userModel
        .find({ deletedAt: '' })
        .skip(skipRecords)
        .limit(recordPerPage);

      return { data: paginationRecords };
    } else throw new BadRequestException(SendResponse.PAGE_LIMIT_ERROR);
  }

  async getUserById(
    userId: string,
    errorMessage?: string,
  ): Promise<ICurrentUserData> {
    const throwErrorMessage: string = errorMessage
      ? errorMessage
      : SendResponse.USER_NOT_FOUND;

    const user: IUser = await this.userModel.findById(
      { _id: new ObjectId(userId) },
      { password: 0 },
    );

    if (user && user.deletedAt === '') {
      return { data: user };
    } else throw new NotFoundException(throwErrorMessage);
  }

  async getUserByEmail(userEmail: string): Promise<IUser> {
    const user: IUser = await this.userModel.findOne({ email: userEmail });
    return user;
  }

  async updateUser(
    userId: string,
    updateUser: updateUserDto,
  ): Promise<ICurrentUserData> {
    const user: IUser = await this.userModel.findById(userId);

    if (user && user.deletedAt === '') {
      const { name, address, oldPassword, newPassword } = updateUser;

      const isPasswordTrue: boolean = await authenticatePassword(
        oldPassword,
        user.password,
      );

      if (isPasswordTrue) {
        const newHashedPassword = await hashPassword(newPassword);
        user.name = name;
        user.address = address;
        user.password = newHashedPassword;
        user.updatedAt = createTimeStamp();

        await this.userModel.updateOne(
          { _id: new ObjectId(userId) },
          { $set: user },
        );

        return {
          data: await this.userModel.findById(
            { _id: new ObjectId(userId) },
            { password: 0 },
          ),
        };
      } else throw new UnauthorizedException(SendResponse.WRONG_PASSWORD);
    } else throw new NotFoundException(SendResponse.USER_NOT_FOUND);
  }

  async deleteUser(userId: string, password: string): Promise<IMessage> {
    const user: IUser = await this.userModel.findById(userId);

    if (user && user.deletedAt === '') {
      const isPasswordTrue: boolean = await authenticatePassword(
        password,
        user.password,
      );
      if (isPasswordTrue) {
        user.deletedAt = createTimeStamp();

        await this.userModel.updateOne(
          { _id: new ObjectId(userId) },
          { $set: user },
        );

        return { message: SendResponse.USER_DELETED };
      } else throw new UnauthorizedException(SendResponse.WRONG_PASSWORD);
    } else throw new NotFoundException(SendResponse.USER_NOT_FOUND);
  }
}
