import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import env from './dotEnvConfig';

export const authenticatePassword = async (
  password: string,
  hashedPassword: string,
) => bcrypt.compare(password, hashedPassword);

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

export const createAccessToken = (payloadData: string | object | Buffer) =>
  jwt.sign(payloadData, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

export const authenticateToken = (token: string) => {
  const bearer = token.split(' ')[1];
  if (bearer === null || bearer === undefined || bearer.length === 0)
    return 'token not provided';

  return jwt.verify(bearer, env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return 'token not valid';
    return user;
  });
};
