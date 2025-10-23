import { UserDocument } from 'modules/users/entities';
import * as mongoose from 'mongoose';
export declare class Notification {
    _id: string;
    url: string;
    text: string;
    image: string;
    isRead: string[];
    sender: UserDocument;
    receivers: string[];
    type: string;
    createdAt: Date;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, mongoose.Document<unknown, any, Notification> & Notification & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Notification, mongoose.Document<unknown, {}, Notification> & Notification & Required<{
    _id: string;
}>>;
export interface NotificationDocument extends Notification, Document {
}
