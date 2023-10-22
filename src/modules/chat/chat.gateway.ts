import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SOCKET_PORT } from '../../constants';
import { MessageService } from 'modules/message/message.service';
import { RoomService } from 'modules/room/room.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(parseInt(SOCKET_PORT), { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log('message chat', data, socket.id);
  }

  async handleConnection(socket: Socket) {
    console.log('connect chat', socket.id);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data?.email);
  }
}
