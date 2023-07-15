import { transports, format } from 'winston';

export const loggerConfig = {
  format: format.combine(
    format.timestamp(),
    format.printf((info) => {
      return `[USER-SERVICE-LOGS] ${info.timestamp} ${info.level}: ${info.message}`;
    }),
  ),
  transports: [
    new transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: format.json(),
    }),
    new transports.File({
      filename: './logs/combined.log',
      format: format.json(),
    }),
    new transports.Console(),
  ],
};
