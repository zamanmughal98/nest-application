import * as bcrypt from 'bcrypt';

export const authenticatePassword = async (
  password: string,
  hashedPassword: string,
) => bcrypt.compare(password, hashedPassword);

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);
