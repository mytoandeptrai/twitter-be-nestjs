import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MyTokenAuthGuard } from 'common/guards';
import { UploadTool } from 'tools';
import { UploadMetaInput } from './dto';
import { UploadService } from './upload.service';
import { MAXIMUM_COUNT_FILES } from './constants';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', MAXIMUM_COUNT_FILES, UploadTool.imageUpload),
  )
  uploadMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() meta: UploadMetaInput,
  ): Promise<string[]> {
    return this.uploadService.uploadMedias(files, meta);
  }
}
