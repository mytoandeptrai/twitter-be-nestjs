import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiQueryGetMany, MyTokenAuthGuard, ResponseDTO } from 'common';
import { GetUser } from 'modules/users/decorators';
import { UserDocument } from 'modules/users/entities';
import { ResponseTool } from 'tools';
import { CreateRoomDTO } from './dto';
import { RoomService } from './room.service';

@ApiTags('Room')
@ApiBearerAuth()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/myRoom')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async getUserRooms(@GetUser() user: UserDocument): Promise<ResponseDTO> {
    const rooms = await this.roomService.getRoomByUser(user);
    return ResponseTool.GET_OK(rooms);
  }

  @Get('/:roomId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getRoomMessages(@Param('roomId') roomId: string): Promise<ResponseDTO> {
    const room = await this.roomService.findById(roomId);
    return ResponseTool.GET_OK(room);
  }

  @Post()
  @UseGuards(MyTokenAuthGuard)
  async createNewRoom(@Body() body: CreateRoomDTO) {
    const newRoom = await this.roomService.createRoom(body);
    return ResponseTool.POST_OK(newRoom);
  }

  @Delete('/:roomId')
  @UseGuards(MyTokenAuthGuard)
  async deleteRoom(
    @GetUser() user: UserDocument,
    @Param('roomId') roomId: string,
  ) {
    await this.roomService.deleteRoom(roomId, user);
    return ResponseTool.DELETE_OK('OK');
  }
}
