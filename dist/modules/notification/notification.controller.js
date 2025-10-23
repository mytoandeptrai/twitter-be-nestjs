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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const decorators_1 = require("../users/decorators");
const entities_1 = require("../users/entities");
const tools_1 = require("../../tools");
const dto_1 = require("./dto");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getAll(user, query) {
        const { data, total } = await this.notificationService.getAllNotifications(user._id, query);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async create(user, notificationDto) {
        return this.notificationService.createNotification(user, notificationDto);
    }
    async deleteAll(user) {
        await this.notificationService.deleteAllNotifications(user._id);
        return tools_1.ResponseTool.DELETE_OK({
            message: 'OK',
        });
    }
    async readMultiNotifications(user, ids) {
        const updatedNotification = await this.notificationService.updateReadStatusAllNotifications(user._id, ids);
        return tools_1.ResponseTool.PATCH_OK(updatedNotification);
    }
    async read(user, id) {
        const updatedNotification = await this.notificationService.updateReadStatusSingleNotification(user._id, id);
        return tools_1.ResponseTool.PATCH_OK(updatedNotification);
    }
    async delete(id) {
        const deletedNotification = await this.notificationService.deleteSingleNotification(id);
        return tools_1.ResponseTool.DELETE_OK(deletedNotification);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateNotificationDTO]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteAll", null);
__decorate([
    (0, common_1.Patch)('/read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "readMultiNotifications", null);
__decorate([
    (0, common_1.Patch)('/read/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "read", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "delete", null);
NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map