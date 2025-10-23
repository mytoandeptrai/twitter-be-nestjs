"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamWinston = exports.loggerWinston = void 0;
const path = __importStar(require("path"));
const winston = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
function stringify(value) {
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
const transports = [];
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    transports.push(new winston_daily_rotate_file_1.default({
        level: 'debug',
        datePattern: 'YYYY-MM-DD-HH',
        dirname: path.join(__dirname, '../../../logs/debug'),
        filename: `%DATE%.log`,
        maxFiles: 30,
        zippedArchive: true,
        utc: true,
    }), new winston_daily_rotate_file_1.default({
        level: 'error',
        datePattern: 'YYYY-MM-DD-HH',
        dirname: path.join(__dirname, '../../../logs/error'),
        filename: `%DATE%.log`,
        maxFiles: 30,
        handleExceptions: true,
        zippedArchive: true,
        utc: true,
    }));
}
transports.push(new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
}));
exports.loggerWinston = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports,
});
exports.streamWinston = {
    write: (message) => {
        exports.loggerWinston.info(message.trim());
    },
};
//# sourceMappingURL=logger.js.map