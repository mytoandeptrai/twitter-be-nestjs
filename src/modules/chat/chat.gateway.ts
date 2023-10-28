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
import { Room, RoomDocument } from 'modules/room/entities/room.entity';
import { UserDocument } from 'modules/users/entities';
import { AuthService } from 'modules/auth/auth.service';

interface ISocketUser {
  socketId: string;
  userId: string;
}

interface ICallingRoom {
  [key: string]: ISocketUser[];
}

@WebSocketGateway(parseInt(SOCKET_PORT), { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  room: Room[] = [];
  callingRoom: ICallingRoom = {};
  connectedUsers: UserDocument[] = [];
  connectedRooms: RoomDocument[] = [];

  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    // console.log('message chat', data, socket.id);
  }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.query?.token as string;
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data?.email);
  }
}
