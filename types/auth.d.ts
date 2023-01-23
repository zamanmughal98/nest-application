interface ILoginData extends IMessage {
  accessToken?: string;
}

interface ISignupData extends IMessage {
  data?: IuserSchmema;
}