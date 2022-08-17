import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const transport = new DailyRotateFile({
  filename: './logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: process.env.MAX_SIZE_LOGGER,
  maxFiles: process.env.MAX_DAY_LOGGER,
  prepend: true,
});

// transport.on('rotate', function (oldFilename, newFilename) {
// do something fun
// });

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        format.colorize(),
        format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
        ),
      ),
      timestamp: true,
    }),
    transport,
  ],
});

export default logger;
