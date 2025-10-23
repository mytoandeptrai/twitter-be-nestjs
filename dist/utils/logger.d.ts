import * as winston from 'winston';
export declare const loggerWinston: winston.Logger;
export declare const streamWinston: {
    write: (message: string) => void;
};
