import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'modules/cloudinary/cloudinary.module';
@Module({
  imports: [ConfigModule, CloudinaryModule],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}
