import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AppError from '../error/AppError';

dotenv.config();

const auth = (roles) => {
  return (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const secretKey = process.env.SECRET_KEY;

    const accessToken = authorization.replace('Bearer ', '');

    if (!accessToken) {
      throw new AppError(`Unauthorized.`, 401);
    }

    const payload = jwt.verify(accessToken, secretKey);

    const { roleNumber } = payload;

    if (!roleNumber) {
      throw new AppError(`Unauthorized.`, 401);
    }

    if (!roles.includes(roleNumber)) {
      throw new AppError(`Forbidden.`, 403);
    }

    res.locals.user = { ...payload };

    return next();
  };
};

export default auth;
