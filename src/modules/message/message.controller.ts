import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiQueryGetMany,
  MyTokenAuthGuard,
  QueryGet,
  ResponseDTO,
} from 'common';
import { QueryOption, QueryPostOption, ResponseTool } from 'tools';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:roomId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.messageService.getRoomMessage(
      roomId,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(data, total);
  }
}
