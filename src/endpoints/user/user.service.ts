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
    @InjectModel(DatabaseNames.USERS) private readonly UserModel: Model<IUser>,
  ) {}

  async getUser(page: string): Promise<IAllUsersData> {
    try {
      // Pagination
      const recordPerPage = 2;
      const pageNo: number = parseInt(page, 10) || 1;
      const skipRecords: number = recordPerPage * (pageNo - 1);
      const maxPages: number = Math.ceil(
        (await this.UserModel.countDocuments({ deletedAt: '' })) /
          recordPerPage,
      );

      if (pageNo <= maxPages) {
        const allUsers: IUser[] = await this.UserModel.find(
          { deletedAt: '' },
          { password: 0 },
        );

        const paginationRecords: IUser[] = allUsers.slice(
          skipRecords,
          skipRecords + recordPerPage,
        );

        if (allUsers && paginationRecords)
          return { Pagination: paginationRecords, Users: allUsers };
        else return { message: SendResponse.USER_NOT_FOUND };
      } else return { message: SendResponse.PAGE_LIMIT_ERROR };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(userId: string): Promise<ICurrentUserData> {
    try {
      const userExists: IUser = await this.UserModel.findById(
        { _id: new ObjectId(userId) },
        { password: 0 },
      );

      if (userExists && userExists.deletedAt === '') {
        return { data: userExists };
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
      const userExists: IUser = await this.UserModel.findById(userId);

      if (userExists && userExists.deletedAt === '') {
        const { name, address, oldPassword, newPassword } = updateUser;

        const isPasswordTrue: boolean = await authenticatePassword(
          oldPassword,
          userExists.password,
        );

        if (isPasswordTrue) {
          const newHashedPassword = await hashPassword(newPassword);
          userExists.name = name;
          userExists.address = address;
          userExists.password = newHashedPassword;
          userExists.updatedAt = createTimeStamp();

          await this.UserModel.updateOne(
            { _id: new ObjectId(userId) },
            { $set: userExists },
          );

          return {
            data: await this.UserModel.findById(
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
      const userExists: IUser = await this.UserModel.findById(userId);

      if (userExists && userExists.deletedAt === '') {
        const isPasswordTrue: boolean = await authenticatePassword(
          password,
          userExists.password,
        );
        if (isPasswordTrue) {
          userExists.deletedAt = createTimeStamp();

          await this.UserModel.updateOne(
            { _id: new ObjectId(userId) },
            { $set: userExists },
          );

          return { message: SendResponse.USER_DELETED };
        } else return { message: SendResponse.WRONG_PASSWORD };
      } else return { message: SendResponse.USER_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
