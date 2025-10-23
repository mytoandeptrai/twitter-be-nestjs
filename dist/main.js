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
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs = __importStar(require("fs"));
const morgan_1 = __importDefault(require("morgan"));
const mongo_tool_1 = require("./tools/mongo.tool");
const utils_1 = require("./utils");
const logger_1 = require("./utils/logger");
const app_module_1 = require("./app.module");
const constants_1 = require("./constants");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.setGlobalPrefix(constants_1.GLOBAL_PATH);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transformerPackage: require('class-transformer'),
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle(constants_1.PROJECT_NAME)
        .setDescription(constants_1.PROJECT_DESCRIPTION)
        .setVersion(constants_1.PROJECT_VERSION)
        .addTag('This is a stupid twitter back-end using nestjs')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(`${constants_1.PATH_DOCUMENT}`, app, document);
    app.use((0, morgan_1.default)(constants_1.PRODUCTION ? 'combined' : 'dev'));
    mongo_tool_1.MongoTool.initialize();
    const uploadPath = (0, utils_1.createUploadsFolder)('uploads');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
    }
    app.enableCors();
    await app.listen(constants_1.PORT || 4000);
    const API_URL = await app.getUrl();
    logger_1.loggerWinston.info(`======= Api ======== : Application is running on: ${API_URL}`);
    logger_1.loggerWinston.info(`======= Docs ======= : Application is running on: ${API_URL}/${constants_1.PATH_DOCUMENT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map