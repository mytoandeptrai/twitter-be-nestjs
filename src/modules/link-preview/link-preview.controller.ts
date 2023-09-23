import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'common';
import { ResponseTool } from 'tools';
import { LinkPreviewService } from './link-preview.service';

@ApiTags('Link-preview')
@Controller('link-preview')
export class LinkPreviewController {
  @Inject()
  private readonly linkPreviewService: LinkPreviewService;

  @Get()
  @ApiResponse({
    type: ResponseDTO,
  })
  async getLinkMetadata(@Query('url') url: string) {
    const metadata = await this.linkPreviewService.getLinkMetadata(url);
    return ResponseTool.GET_OK(metadata);
  }
}
