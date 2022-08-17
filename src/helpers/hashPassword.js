import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const hashPassword = (password) => {
  const saltRounds = Number.parseInt(process.env.SALT_ROUNDS, 10) || 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  return bcrypt.hashSync(password, salt);
};

export default hashPassword;
