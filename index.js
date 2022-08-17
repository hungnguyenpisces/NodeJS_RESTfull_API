/* eslint-disable no-unused-vars */
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import sendError from './src/middlewares/error/sendError';
import router from './src/routes';
import logger from './src/helpers/logger';
import AppError from './src/middlewares/error/AppError';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());

app.use(json());

app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome to our application.',
  });
});

app.use(router);

app.all('*', (req, res) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server.`, 404);
});

app.use(errors());
app.use(sendError);

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
