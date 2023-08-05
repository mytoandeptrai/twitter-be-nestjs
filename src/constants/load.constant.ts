import {
  DATABASE_URL,
  DEVELOPMENT,
  ENVIRONMENT,
  JWT_EXP,
  JWT_SECRET,
  MONGO_DB_NAME,
  MONGO_PASSWORD,
  MONGO_USERNAME,
  PORT,
  PRODUCTION,
} from './config.constant';

export default () => ({
  environment: ENVIRONMENT,
  production: PRODUCTION,
  development: DEVELOPMENT,

  port: PORT,

  mongo: {
    dbName: MONGO_DB_NAME,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: DATABASE_URL,
  },
  jwt: {
    secret: JWT_SECRET,
    exp: JWT_EXP,
  },
});
