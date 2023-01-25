interface ILoginData {
  accessToken: string;
}

interface ISignupData {
  data: IuserSchmema;
}

interface IPayload {
  _id: string ;
  name: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt:string;
  deletedAt: string;
  iat: number;
  exp: number;
}
