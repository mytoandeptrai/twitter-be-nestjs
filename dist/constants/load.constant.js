"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_constant_1 = require("./config.constant");
exports.default = () => ({
    environment: config_constant_1.ENVIRONMENT,
    production: config_constant_1.PRODUCTION,
    development: config_constant_1.DEVELOPMENT,
    port: config_constant_1.PORT,
    mongo: {
        dbName: config_constant_1.MONGO_DB_NAME,
        username: config_constant_1.MONGO_USERNAME,
        password: config_constant_1.MONGO_PASSWORD,
        url: config_constant_1.DATABASE_URL,
    },
    jwt: {
        secret: config_constant_1.JWT_SECRET,
        exp: config_constant_1.JWT_EXP,
    },
});
//# sourceMappingURL=load.constant.js.map