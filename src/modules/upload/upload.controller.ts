import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MyTokenAuthGuard } from 'common';
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
  uploadMedias(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() meta: UploadMetaInput,
  ): Promise<string[]> {
    return this.uploadService.uploadMedias(files, meta);
  }

  @Post('/image')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', UploadTool.imageUpload))
  uploadMedia(
    @UploadedFile() image: Express.Multer.File,
    @Body() meta: UploadMetaInput,
  ) {
    return this.uploadService.uploadMedias([image], meta);
  }
}
