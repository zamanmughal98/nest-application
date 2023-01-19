import { ObjectId } from 'mongoose';
import { validationMessageDto } from './common.dto';

export class loginDto {
  email: string;
  password: string;
}
export class signupDto {
  email: string;
  password: string;
  address: string;
  name: string;
}
export class loginDataDto extends validationMessageDto {
  accessToken?: string;
}

export class TokenDto {
  sessionId: string;
  userId: string;
  token: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id: ObjectId;
  __v: number;
}
