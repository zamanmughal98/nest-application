import { Injectable } from '@nestjs/common';
import { updateUserDto } from 'src/dto/user.dto';

@Injectable()
export class userServices {
  constructor() {}

  async createUser(userData: IUserSchmema) {
    return { userData };
  }

  async getUser(page: string) {
    const recordPerPage = 2;
    const pageNo: number = parseInt(page, 10) || 1;
    const skipRecords: number = recordPerPage * (pageNo - 1);

    return { pageNo, skipRecords };
  }

  async getUserById(userId: string, errorMessage?: string) {
    errorMessage = 'errorMessage';
    return { userId, errorMessage };
  }

  async getUserByEmail(userEmail: string) {
    return { userEmail };
  }

  async updateUser(userId: string, updateUser: updateUserDto) {
    return { userId, updateUser };
  }

  async deleteUser(userId: string, password: string) {
    return { userId, password };
  }
}
