import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageService } from 'modules/message/message.service';
import { RoomService } from 'modules/room/room.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3032, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log('🚀 ~ file: chat.gate', socket);
    /** TODO: Validate user before connected */
    // const authHeader = socket.handshake.headers.authorization;
    // if (authHeader && (authHeader as string).split(' ')[1]) {
    //   console.log(
    //     '🚀 ~ file: chat.gateway.ts:25 ~ handleConnection ~ authHeader:',
    //     authHeader,
    //   );
    // } else {
    //   socket.disconnect();
    // }
  }

  async handleDisconnect(socket: Socket) {
    console.log(
      '🚀 ~ file: chat.gateway.ts:35 ~ handleDisconnect ~ client:',
      socket.id,
    );
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    return 'Hello world';
  }
}
