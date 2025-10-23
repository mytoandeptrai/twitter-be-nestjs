import * as winston from 'winston';
declare const loggerWinston: winston.Logger;
declare const streamWinston: {
    write: (message: string) => void;
};
export { loggerWinston, streamWinston };
