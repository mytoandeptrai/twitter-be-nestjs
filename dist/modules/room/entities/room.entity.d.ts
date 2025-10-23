import * as mongoose from 'mongoose';
import { UserDocument } from 'modules/users/entities';
export declare class Room {
    _id: string;
    name: string;
    description: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    isDm: boolean;
    owner: UserDocument;
    members: UserDocument[];
}
export declare const RoomSchema: mongoose.Schema<Room, mongoose.Model<Room, any, any, any, mongoose.Document<unknown, any, Room> & Room & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Room, mongoose.Document<unknown, {}, Room> & Room & Required<{
    _id: string;
}>>;
export interface RoomDocument extends Room, Document {
}
