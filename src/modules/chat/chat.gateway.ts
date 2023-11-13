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
import { CreateRoomDTO } from 'modules/room/dto';

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

  async getDMRoomId(roomId: string) {
    let room: RoomDocument | undefined | null = null;
    /** 1: Find in connected Room */
    room = await this.connectedRooms.find(
      (r: RoomDocument) => r?._id?.toString() === roomId,
    );

    if (!room) {
      room = await this.roomService.findById(roomId);
      !!room?._id && this.connectedRooms.push(room);
    }

    return room;
  }

  async findRoom(memberIds: string[]) {
    if (memberIds.length === 1 || memberIds.length === 0) {
      return null;
    }

    /** Find all members in connected rooms */
    let room: RoomDocument | null | undefined = this.connectedRooms.find(
      (rm: RoomDocument) => {
        const roomMemberIds =
          rm?.members?.map((member: UserDocument) => member._id.toString()) ||
          [];

        return memberIds?.every((memberId: string) =>
          roomMemberIds?.includes(memberId),
        );
      },
    );

    /** Check if we can't find room in connected rooms, try finding it in db */
    if (!room) {
      room = await this.roomService.findDmRoom(memberIds?.[0], memberIds?.[1]);
      room?._id && this.connectedRooms.push(room);
    }

    /** If we can't find room in both db and local -> create new room */
    if (!room) {
      const newRoomDTO: CreateRoomDTO = {
        name: '',
        isDm: true,
        members: memberIds,
        isPrivate: true,
        description: '',
      };
      room = await this.roomService.createRoom(newRoomDTO);
      this.connectedRooms.push(room);
    }

    return room;
  }

  findConnectedUserById(userId: string) {
    if (userId) {
      return this.connectedUsers.find(
        (user: UserDocument) => user._id.toString() === userId.toString(),
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log('message chat', data, socket.id);
  }

  @SubscribeMessage('userOn')
  async handleAddConnectedUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data,
  ) {
    const newUserId = data?._id;
    if (newUserId) {
      const existedUser = this.findConnectedUserById(newUserId);
      if (existedUser) return;

      this.connectedUsers.push({
        ...data,
        socketId: socket.id,
        callingId: null,
      });

      this.server.emit('usersConnected', this.connectedUsers);
    }
  }

  @SubscribeMessage('userOff')
  async handleRemoveConnectedUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data,
  ) {
    const existedUserId = data?._id;
    if (existedUserId) {
      this.connectedUsers = this.connectedUsers.filter(
        (user: UserDocument) => user._id !== existedUserId,
      );
      this.server.emit('usersConnected', this.connectedUsers);
    }
  }

  @SubscribeMessage('newMessage')
  async handleCreateNewMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data,
  ) {
    if (data) {
      const roomId = data.roomId;
      try {
        const existedRoom = await this.getDMRoomId(roomId);

        if (!existedRoom) {
          return this.server
            .to(data?.author?._id)
            .emit('errorRoom', 'There is no existed room ');
        }

        const newMessage = await this.messageService.createMessage(
          data,
          existedRoom._id,
        );

        /** Emit event to all users in that room if they're online */
        existedRoom.members.forEach((mb: UserDocument) => {
          const user = this.connectedUsers.find(
            (e) => e._id.toString() === mb._id.toString(),
          );

          if (user?.socketId) {
            this.server.to(user.socketId).emit('newMessage', newMessage);
          }
        });
      } catch (error) {
        this.server.to(data?.author?._id).emit('error', error);
      }
    }
  }

  @SubscribeMessage('newDMRoom')
  async handleNewRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    const { owner, members } = body;
    const ownerUser = this.findConnectedUserById(owner);
    if (ownerUser?.socketId) {
      const room = await this.findRoom(members);
      if (room) {
        this.server.to(ownerUser.socketId).emit('newDMRoom', room);
      }
    }
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    const receivers = body?.receivers || [];
    if (receivers.length === 0) return;

    receivers?.forEach((id: string) => {
      const user = this.connectedUsers.find((e) => e._id.toString() === id);
      if (user) {
        this.server.to(user.socketId).emit('newNotification', body);
      }
    });
  }

  async handleConnection(socket: Socket) {
    /**
     * const token = socket.handshake.query?.token as string;
     */
    console.log('🚀 Client is connecting', socket.id);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data?.email);
  }
}
