"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("../../common");
const entities_1 = require("../users/entities");
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const entities_2 = require("./entities");
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.notificationModel.countDocuments(conditions).exec()
            : this.notificationModel.estimatedDocumentCount().exec();
    }
    async findAll(option, conditions = {}) {
        return this.notificationModel
            .find(conditions)
            .sort(option.sort)
            .skip(option.skip)
            .limit(option.limit)
            .populate('sender', '_id name avatar');
    }
    async findAllAndCount(option, conditions = {}) {
        const data = await this.findAll(option, conditions);
        const total = await this.count({ conditions });
        return { data, total };
    }
    async getAllNotifications(userId, query) {
        const conditions = { receivers: `${userId}` };
        if (query.options) {
            query.options.sort = { createdAt: -1 };
        }
        const response = await this.findAllAndCount(query.options, conditions);
        return response;
    }
    async createNotification(user, notificationDto) {
        const newNotification = new this.notificationModel(notificationDto);
        newNotification.sender = user;
        newNotification.createdAt = new Date();
        newNotification.isRead = [];
        return newNotification.save();
    }
    async updateReadStatusSingleNotification(notificationId, userId) {
        const notification = await this.notificationModel.findById(notificationId);
        if (notification) {
            if (!notification.isRead.includes(userId)) {
                notification.isRead.push(userId);
                return notification.save();
            }
        }
    }
    async updateReadStatusAllNotifications(userId, ids) {
        const notifications = await this.notificationModel.find({
            _id: { $in: ids },
        });
        if (!!notifications.length) {
            notifications.forEach((notification) => {
                if (!notification.isRead.includes(userId)) {
                    notification.isRead.push(userId);
                }
            });
            await this.notificationModel.bulkWrite(notifications.map((notification) => ({
                updateOne: {
                    filter: { _id: notification._id },
                    update: { $set: { isRead: notification.isRead } },
                },
            })));
        }
    }
    async deleteSingleNotification(notificationId) {
        return this.notificationModel.findByIdAndDelete(notificationId);
    }
    async deleteAllNotifications(userId) {
        const conditions = {
            ' user._id': userId,
        };
        return this.notificationModel.deleteMany(conditions);
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_2.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map