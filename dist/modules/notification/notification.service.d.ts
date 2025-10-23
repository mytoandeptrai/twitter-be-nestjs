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
import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { CreateNotificationDTO } from './dto';
import { Notification, NotificationDocument } from './entities';
export declare class NotificationService {
    private readonly notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    findAll(option: QueryOption, conditions?: any): Promise<Notification[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    getAllNotifications(userId: string, query: QueryPostOption): Promise<ResponseDTO>;
    createNotification(user: UserDocument, notificationDto: CreateNotificationDTO): Promise<Notification>;
    updateReadStatusSingleNotification(notificationId: string, userId: string): Promise<Notification | undefined>;
    updateReadStatusAllNotifications(userId: string, ids: string[]): Promise<void>;
    deleteSingleNotification(notificationId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument> & NotificationDocument & Required<{
        _id: string;
    }>) | null>;
    deleteAllNotifications(userId: string): Promise<import("mongodb").DeleteResult>;
}
