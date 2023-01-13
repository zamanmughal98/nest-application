interface IContext {
  request: {
    session: {
      id: string;
    };
    user: IUser;
  };
}
