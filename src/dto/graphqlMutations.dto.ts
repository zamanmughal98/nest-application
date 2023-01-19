export class IContext {
  request: {
    session: {
      id: string;
    };
    user: IUser;
  };
}
