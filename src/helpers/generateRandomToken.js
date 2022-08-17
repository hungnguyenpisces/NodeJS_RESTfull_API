import { randomBytes } from 'crypto';

const generateRandomToken = () => {
  return randomBytes(40).toString('hex');
};
export default generateRandomToken;
