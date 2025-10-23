import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { QueryPostOption } from 'tools';
import { CreateNotificationDTO } from './dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getAll(user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    create(user: UserDocument, notificationDto: CreateNotificationDTO): Promise<import("./entities").Notification>;
    deleteAll(user: UserDocument): Promise<ResponseDTO>;
    readMultiNotifications(user: UserDocument, ids: string[]): Promise<ResponseDTO>;
    read(user: UserDocument, id: string): Promise<ResponseDTO>;
    delete(id: string): Promise<ResponseDTO>;
}
