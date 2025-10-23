/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { RoomDocument } from './entities/room.entity';
import { MessageService } from 'modules/message/message.service';
import { UsersService } from 'modules/users/users.service';
import { QueryOption } from 'tools';
import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { CreateRoomDTO } from './dto';
export declare class RoomService {
    private roomModel;
    private readonly messageService;
    private readonly userService;
    constructor(roomModel: Model<RoomDocument>, messageService: MessageService, userService: UsersService);
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    findAll(option: QueryOption, conditions?: any): Promise<RoomDocument[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    findById(id: string): Promise<(import("mongoose").Document<unknown, {}, RoomDocument> & RoomDocument & Required<{
        _id: string;
    }>) | null>;
    findDmRoom(userIdA: string, userIdB: string): Promise<RoomDocument | null>;
    getRoomByUser(user: UserDocument): Promise<Omit<import("mongoose").Document<unknown, {}, RoomDocument> & RoomDocument & Required<{
        _id: string;
    }>, never>[]>;
    getDMRoomOfUser(userAId: string, userBId: string): Promise<import("mongoose").Document<unknown, {}, RoomDocument> & RoomDocument & Required<{
        _id: string;
    }>>;
    createRoom(roomDto: CreateRoomDTO): Promise<RoomDocument>;
    addMember(roomID: string, user: UserDocument): Promise<undefined>;
    deleteRoom(id: string, user: UserDocument): Promise<[import("mongodb").DeleteResult, (import("mongoose").Document<unknown, {}, RoomDocument> & RoomDocument & Required<{
        _id: string;
    }>) | null]>;
}
