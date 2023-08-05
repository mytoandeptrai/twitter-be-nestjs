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

// logs dir
// const logDir: string = path.join(
//   __dirname,
//   '../../..',
//   Boolean(process.env.DIRLOG)
//     ? path.posix.join(environment.log.dir, 'worker')
//     : environment.log.dir,
// );

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

// Define log format

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

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const loggerWinston = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: path.join(__dirname, 'debug.log'), // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
      utc: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: path.join(__dirname, 'error.log'), // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
      utc: true,
    }),
  ],
});

loggerWinston.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
    ),
  }),
);

const streamWinston = {
  write: (message: string) => {
    loggerWinston.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { loggerWinston, streamWinston };
