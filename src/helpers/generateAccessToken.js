import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
  });
};

export default generateAccessToken;
