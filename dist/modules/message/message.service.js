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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("../../common");
const lodash_1 = __importDefault(require("lodash"));
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const entities_1 = require("./entities");
let MessageService = class MessageService {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.messageModel.countDocuments(conditions).exec()
            : this.messageModel.estimatedDocumentCount().exec();
    }
    async findAll(option, conditions = {}) {
        return this.messageModel
            .find(conditions)
            .sort(Object.assign(Object.assign({}, option.sort), { createdAt: -1 }))
            .skip(option.skip)
            .limit(option.limit)
            .populate('author', '_id name avatar');
    }
    async findAllAndCount(option, conditions = {}) {
        const data = await this.findAll(option, conditions);
        const total = await this.count({ conditions });
        return { data, total };
    }
    async findById(id) {
        return await this.messageModel.findById(id).lean();
    }
    async getRoomMessage(roomId, option) {
        const conditions = {
            roomId: roomId.toString(),
        };
        const response = await this.findAllAndCount(option, conditions);
        return response;
    }
    async createMessage(messageDto, roomId) {
        const newMessage = new this.messageModel(Object.assign(Object.assign({}, lodash_1.default.omit(messageDto, ['_id'])), { roomId: roomId, createdAt: new Date() }));
        return await newMessage.save();
    }
    async deleteMessages(roomId) {
        return await this.messageModel.deleteMany({ roomId });
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map