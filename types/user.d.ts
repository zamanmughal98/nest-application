interface IUser {
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
interface IUserSchmema {
  name: string;
  email: string;
  password?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

interface IParamUserID {
  userId: string;
}

interface IAllUsersData extends IMessage {
  data?: { Pagination?: IUser[]; Users?: IUser[] };
}
interface ICurrentUserData extends IMessage {
  data?: IUser;
}

interface IAllUsers {
  page: string;
}
interface ICrrentUser extends Express.Request {
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

interface IUpdateUser {
  oldPassword: string;
  newPassword: string;
  address: string;
  name: string;
}

interface IDeleteUser {
  password: string;
}
