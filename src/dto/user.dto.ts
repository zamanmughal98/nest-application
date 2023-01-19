import { ObjectId } from 'mongoose';
import { messageDto } from './common.dto';
import { Request } from 'express';

export class userDto {
  name: string;
  address: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id?: ObjectId;
  __v?: number;
}
export class userSchmemaDto {
  name: string;
  email: string;
  password?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export class paramUserIDDto {
  userId: string;
}

export class allUsersDataDto extends messageDto {
  data?: { Pagination?: userDto[]; Users?: userDto[] };
}
export class currentUserDataDto extends messageDto {
  data?: userDto;
}

export class allUsersDto {
  page: string;
}
export class crrentUserDto extends Request {
  user?: {
    _id?: ObjectId;
    name?: string;
    address?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    iat?: number;
  };
}

export class updateUserDto {
  oldPassword: string;
  newPassword: string;
  address: string;
  name: string;
}

export class deleteUserDto {
  password: string;
}
