import * as path from 'path';
import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

function stringify(value: any) {
  switch (typeof value) {
    case 'object':
      return JSON.stringify(value);
    default:
      return String(value);
  }
}

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
});

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${stringify(message)}`;
});

const transports: winston.transport[] = [];

if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  transports.push(
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: path.join(__dirname, '../../../logs/debug'),
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
      utc: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: path.join(__dirname, '../../../logs/error'),
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      zippedArchive: true,
      utc: true,
    }),
  );
}

// ✅ Luôn log ra console (serverless bắt buộc)
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
    ),
  }),
);

export const loggerWinston = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports,
});

export const streamWinston = {
  write: (message: string) => {
    loggerWinston.info(message.trim());
  },
};
