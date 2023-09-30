import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { CreateNotificationDTO } from './dto';
import { Notification, NotificationDocument } from './entities';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  /** COMMONS */
  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.notificationModel.countDocuments(conditions).exec()
      : this.notificationModel.estimatedDocumentCount().exec();
  }

  async findAll(
    option: QueryOption,
    conditions: any = {},
  ): Promise<Notification[]> {
    return this.notificationModel
      .find(conditions)
      .sort(option.sort)
      .skip(option.skip as number)
      .limit(option.limit as number)
      .populate('sender', '_id name avatar');
  }

  async findAllAndCount(
    option: QueryOption,
    conditions: any = {},
  ): Promise<ResponseDTO> {
    const data = await this.findAll(option, conditions);
    const total = await this.count({ conditions });
    return { data, total };
  }

  /** QUERIES */

  async getAllNotifications(
    userId: string,
    query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const conditions = { receivers: `${userId}` };
    if (query.options) {
      query.options.sort = { createdAt: -1 };
    }

    const response = await this.findAllAndCount(
      query.options as QueryOption,
      conditions,
    );
    return response;
  }

  /** MUTATIONS */

  async createNotification(
    user: UserDocument,
    notificationDto: CreateNotificationDTO,
  ): Promise<Notification> {
    const newNotification = new this.notificationModel(notificationDto);
    newNotification.sender = user;
    newNotification.createdAt = new Date();
    newNotification.isRead = [];
    return newNotification.save();
  }

  async updateReadStatusSingleNotification(
    notificationId: string,
    userId: string,
  ): Promise<Notification | undefined> {
    const notification = await this.notificationModel.findById(notificationId);
    if (notification) {
      if (!notification.isRead.includes(userId)) {
        notification.isRead.push(userId);
        return notification.save();
      }
    }
  }

  async updateReadStatusAllNotifications(
    userId: string,
    ids: string[],
  ): Promise<void> {
    const notifications = await this.notificationModel.find({
      _id: { $in: ids },
    });

    if (!!notifications.length) {
      /** using bulkWrite in mongo to update multiple fields in document */
      notifications.forEach((notification) => {
        if (!notification.isRead.includes(userId)) {
          notification.isRead.push(userId);
        }
      });

      await this.notificationModel.bulkWrite(
        notifications.map((notification) => ({
          updateOne: {
            filter: { _id: notification._id },
            update: { $set: { isRead: notification.isRead } },
          },
        })),
      );

      /** using promise all for normal case
         const updatePromises = notifications.map(async (notification) => {
            if (!notification.isRead.includes(userId)) {
            notification.isRead.push(userId);
            return notification.save();
            }
        });

        await Promise.all(updatePromises);
       */
    }
  }

  async deleteSingleNotification(notificationId: string) {
    return this.notificationModel.findByIdAndDelete(notificationId);
  }

  async deleteAllNotifications(userId: string) {
    const conditions = {
      ' user._id': userId,
    };
    return this.notificationModel.deleteMany(conditions);
  }
}
