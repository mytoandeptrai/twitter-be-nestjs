import { ResponseDTO } from 'common';
import { Model } from 'mongoose';
import { QueryOption } from 'tools';
import { CreateMessageDTO } from './dto';
import { Message, MessageDocument } from './entities';
export declare class MessageService {
    private readonly messageModel;
    constructor(messageModel: Model<MessageDocument>);
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    findAll(option: QueryOption, conditions?: any): Promise<Message[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    findById(id: string): Promise<MessageDocument | null>;
    getRoomMessage(roomId: string, option: QueryOption): Promise<ResponseDTO>;
    createMessage(messageDto: CreateMessageDTO, roomId: string): Promise<MessageDocument | null>;
    deleteMessages(roomId: string): Promise<import("mongodb").DeleteResult>;
}
