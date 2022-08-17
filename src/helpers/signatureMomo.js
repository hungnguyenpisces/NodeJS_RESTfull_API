/* eslint-disable new-cap */
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

const secretKey = process.env.MOMO_SECRET_KEY;
const iv = new Buffer.alloc(16); // 16 byte buffer with random data
iv.fill(0); // fill with zeros

const encryptToken = (data) => {
  const encipher = crypto.createCipheriv('sha256', secretKey, iv);
  const buffer = Buffer.concat([encipher.update(data), encipher.final()]);

  return buffer.toString('base64');
};

const decryptToken = (data) => {
  const decipher = crypto.createDecipheriv('sha256', secretKey, iv);
  const buffer = Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]);

  return buffer.toString();
};

export { encryptToken, decryptToken };
