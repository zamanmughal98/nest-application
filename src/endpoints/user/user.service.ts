import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { updateUserDto } from 'src/dto/user.dto';
import { authenticatePassword, hashPassword } from 'src/utils/authentication';
import { createTimeStamp, DatabaseNames, SendResponse } from 'src/utils/common';

@Injectable()
export class userServices {
  constructor(
    @InjectModel(DatabaseNames.USERS) private readonly userModel: Model<IUser>,
  ) {}

  async getUser(page: string): Promise<IUsersPaginationData> {
    try {
      // Pagination
      const recordPerPage = 2;
      const pageNo: number = parseInt(page, 10) || 1;
      const skipRecords: number = recordPerPage * (pageNo - 1);
      const maxPages: number = Math.ceil(
        (await this.userModel.countDocuments({ deletedAt: '' })) /
          recordPerPage,
      );

      if (pageNo <= maxPages) {
        const users: IUser[] = await this.userModel.find(
          { deletedAt: '' },
          { password: 0 },
        );

        const paginationRecords: IUser[] = users.slice(
          skipRecords,
          skipRecords + recordPerPage,
        );

        if (paginationRecords) return { data: paginationRecords };
        else return { message: SendResponse.USER_NOT_FOUND };
      } else return { message: SendResponse.PAGE_LIMIT_ERROR };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(userId: string): Promise<ICurrentUserData> {
    try {
      const user: IUser = await this.userModel.findById(
        { _id: new ObjectId(userId) },
        { password: 0 },
      );

      if (user && user.deletedAt === '') {
        return { data: user };
      } else return { message: SendResponse.USER_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(
    userId: string,
    updateUser: updateUserDto,
  ): Promise<ICurrentUserData> {
    try {
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
        } else return { message: SendResponse.WRONG_PASSWORD };
      } else return { message: SendResponse.USER_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(userId: string, password: string): Promise<IMessage> {
    try {
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
        } else return { message: SendResponse.WRONG_PASSWORD };
      } else return { message: SendResponse.USER_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
