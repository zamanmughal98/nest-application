interface ILoginData extends IValidationMessage {
  accessToken?: string;
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
