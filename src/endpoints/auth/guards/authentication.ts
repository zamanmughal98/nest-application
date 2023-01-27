import * as bcrypt from 'bcrypt';

export const authenticatePassword = async (
  password: string,
  hashedPassword: string,
) => bcrypt.compare(password, hashedPassword);

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};
