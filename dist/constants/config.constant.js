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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_FILE_PATH = exports.AVATAR_URL = exports.JWT_EXP = exports.JWT_SECRET = exports.SWAGGER_PATH = exports.DATABASE_URL = exports.MONGO_URI = exports.MONGO_PASSWORD = exports.MONGO_USERNAME = exports.MONGO_DB_NAME = exports.MONGO_URL = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_NAME = exports.CLOUDINARY_FOLDER_VIDEO = exports.CLOUDINARY_FOLDER_IMAGE = exports.CLOUDINARY_PATH_DEV = exports.CLOUDINARY_PATH = exports.CLOUDINARY_URL = exports.PROJECT_DESCRIPTION = exports.PROJECT_VERSION = exports.PROJECT_NAME = exports.SOCKET_PORT = exports.PORT = exports.DEVELOPMENT = exports.PRODUCTION = exports.ENVIRONMENT = exports.getEnv = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getEnv = (key) => {
    const value = process.env[key];
    return value || '';
};
exports.getEnv = getEnv;
exports.ENVIRONMENT = (0, exports.getEnv)('ENVIRONMENT');
exports.PRODUCTION = exports.ENVIRONMENT === 'production';
exports.DEVELOPMENT = exports.ENVIRONMENT === 'development';
exports.PORT = (0, exports.getEnv)('PORT');
exports.SOCKET_PORT = (0, exports.getEnv)('SOCKET_PORT');
exports.PROJECT_NAME = (0, exports.getEnv)('PROJECT_NAME');
exports.PROJECT_VERSION = (0, exports.getEnv)('PROJECT_VERSION');
exports.PROJECT_DESCRIPTION = (0, exports.getEnv)('PROJECT_DESCRIPTION');
exports.CLOUDINARY_URL = (0, exports.getEnv)('CLOUDINARY_URL');
exports.CLOUDINARY_PATH = (0, exports.getEnv)('CLOUDINARY_PATH');
exports.CLOUDINARY_PATH_DEV = (0, exports.getEnv)('CLOUDINARY_PATH_DEV');
exports.CLOUDINARY_FOLDER_IMAGE = (0, exports.getEnv)('CLOUDINARY_FOLDER_IMAGE');
exports.CLOUDINARY_FOLDER_VIDEO = (0, exports.getEnv)('CLOUDINARY_FOLDER_VIDEO');
exports.CLOUDINARY_NAME = (0, exports.getEnv)('CLOUDINARY_NAME');
exports.CLOUDINARY_API_KEY = (0, exports.getEnv)('CLOUDINARY_API_KEY');
exports.CLOUDINARY_API_SECRET = (0, exports.getEnv)('CLOUDINARY_API_SECRET');
exports.MONGO_URL = (0, exports.getEnv)('MONGO_URL');
exports.MONGO_DB_NAME = (0, exports.getEnv)('MONGO_DB_NAME');
exports.MONGO_USERNAME = (0, exports.getEnv)('MONGO_USERNAME');
exports.MONGO_PASSWORD = (0, exports.getEnv)('MONGO_PASSWORD');
exports.MONGO_URI = (0, exports.getEnv)('MONGO_URI');
exports.DATABASE_URL = exports.MONGO_URI.replace('{username}', exports.MONGO_USERNAME)
    .replace('{password}', exports.MONGO_PASSWORD)
    .replace('{db-name}', exports.MONGO_DB_NAME);
exports.SWAGGER_PATH = (0, exports.getEnv)('SWAGGER_PATH');
exports.JWT_SECRET = (0, exports.getEnv)('JWT_SECRET');
exports.JWT_EXP = Number((0, exports.getEnv)('JWT_EXP'));
exports.AVATAR_URL = (0, exports.getEnv)('AVATAR_URL');
exports.UPLOAD_FILE_PATH = (0, exports.getEnv)('UPLOAD_FILE_PATH');
//# sourceMappingURL=config.constant.js.map