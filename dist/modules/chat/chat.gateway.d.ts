import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
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
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private roomService;
    private messageService;
    private authService;
    server: Server;
    room: Room[];
    callingRoom: ICallingRoom;
    connectedUsers: UserDocument[];
    connectedRooms: RoomDocument[];
    constructor(roomService: RoomService, messageService: MessageService, authService: AuthService);
    getDMRoomId(roomId: string): Promise<RoomDocument | null>;
    findRoom(memberIds: string[]): Promise<RoomDocument | null>;
    findConnectedUserById(userId: string): UserDocument | undefined;
    handleMessage(socket: Socket, data: any): Promise<void>;
    handleAddConnectedUser(socket: Socket, data: any): Promise<void>;
    handleRemoveConnectedUser(socket: Socket, data: any): Promise<void>;
    handleCreateNewMessage(socket: Socket, data: any): Promise<boolean | undefined>;
    handleNewRoom(socket: Socket, body: any): Promise<void>;
    handleCreateNotification(socket: Socket, body: any): Promise<void>;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
}
export {};
