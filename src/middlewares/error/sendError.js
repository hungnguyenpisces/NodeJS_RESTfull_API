/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import logger from '../../helpers/logger';

dotenv.config();

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.statusCode === 500) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  return res.status(err.statusCode).json({ error: err.message });
};

const sendError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  switch (err.status) {
    case 'fail':
      logger.warn(`${req.method} ${req.originalUrl}: ${err.message}`);
      break;
    case 'error':
      logger.error(`${req.method} ${req.originalUrl}: ${err.message}`);
      break;
    default:
      break;
  }

  switch (process.env.NODE_ENV) {
    case 'development':
      return sendErrorDev(err, res);
    case 'production':
      return sendErrorProd(err, res);
    default:
      break;
  }
};

export default sendError;
