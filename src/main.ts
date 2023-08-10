import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import morgan from 'morgan';
import { MongoTool } from 'tools/mongo.tool';
import { loggerWinston } from 'utils/logger';
import { AppModule } from './app.module';
import {
  GLOBAL_PATH,
  PATH_DOCUMENT,
  PORT,
  PRODUCTION,
  PROJECT_DESCRIPTION,
  PROJECT_NAME,
  PROJECT_VERSION,
} from './constants';
import path from 'path';
import * as fs from 'fs';
import { createUploadsFolder } from 'utils';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PATH);
  app.useGlobalPipes(
    new ValidationPipe({
      transformerPackage: require('class-transformer'),
    }),
  );

  // Setup documents
  const config = new DocumentBuilder()
    .setTitle(PROJECT_NAME)
    .setDescription(PROJECT_DESCRIPTION)
    .setVersion(PROJECT_VERSION)
    .addTag('Hybrid')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${PATH_DOCUMENT}`, app, document);

  // Logger
  app.use(morgan(PRODUCTION ? 'combined' : 'dev'));

  // Connect MongoDB
  MongoTool.initialize();
  const uploadPath = createUploadsFolder('uploads');

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  // Config listen
  app.enableCors();
  await app.listen(PORT || 4000);

  const API_URL = await app.getUrl();
  loggerWinston.info(
    `======= Api ======== : Application is running on: ${API_URL}`,
  );
  loggerWinston.info(
    `======= Docs ======= : Application is running on: ${API_URL}/${PATH_DOCUMENT}`,
  );
}
bootstrap();
