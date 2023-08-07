import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  create() {
    return;
  }

  @Get()
  findAll() {
    return;
  }

  @Put('/:id')
  update() {
    return;
  }

  @Delete('/:id')
  delete() {
    return;
  }
}
