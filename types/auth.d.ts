interface ILogin {
  email: string;
  password: string;
}
interface ISignup {
  email: string;
  password: string;
  address: string;
  name: string;
}
interface ILoginData extends IValidationMessage {
  accessToken?: string;
}
interface ISignupData extends IValidationMessage {
  data?: IuserSchmema;
}

interface IToken {
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
