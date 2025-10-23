import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { CreateRoomDTO } from './dto';
import { RoomService } from './room.service';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    getUserRooms(user: UserDocument): Promise<ResponseDTO>;
    getRoomMessages(roomId: string): Promise<ResponseDTO>;
    createNewRoom(body: CreateRoomDTO): Promise<ResponseDTO>;
    deleteRoom(user: UserDocument, roomId: string): Promise<ResponseDTO>;
}
