import * as dotenv from 'dotenv';

dotenv.config();

export const getEnv = (key: string) => {
  const value = process.env[key];
  return value || '';
};

// Server
export const ENVIRONMENT = getEnv('ENVIRONMENT');
export const PRODUCTION = ENVIRONMENT === 'production';
export const DEVELOPMENT = ENVIRONMENT === 'development';
export const PORT = getEnv('PORT');

// Project
export const PROJECT_NAME = getEnv('PROJECT_NAME');
export const PROJECT_VERSION = getEnv('PROJECT_VERSION');
export const PROJECT_DESCRIPTION = getEnv('PROJECT_DESCRIPTION');

// MongoDB
export const MONGO_URL = getEnv('MONGO_URL');
export const MONGO_DB_NAME = getEnv('MONGO_DB_NAME');
export const MONGO_USERNAME = getEnv('MONGO_USERNAME');
export const MONGO_PASSWORD = getEnv('MONGO_PASSWORD');
export const MONGO_URI = getEnv('MONGO_URI');
export const DATABASE_URL = MONGO_URI.replace('{username}', MONGO_USERNAME)
  .replace('{password}', MONGO_PASSWORD)
  .replace('{db-name}', MONGO_DB_NAME);

// Swagger
export const SWAGGER_PATH = getEnv('SWAGGER_PATH');

// Auth
export const JWT_SECRET = getEnv('JWT_SECRET');
export const JWT_EXP = Number(getEnv('JWT_EXP'));

// Default variables
export const AVATAR_URL = getEnv('AVATAR_URL');
