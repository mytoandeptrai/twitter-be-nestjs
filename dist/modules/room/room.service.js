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
exports.RoomService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const room_entity_1 = require("./entities/room.entity");
const message_service_1 = require("../message/message.service");
const users_service_1 = require("../users/users.service");
const tools_1 = require("../../tools");
const common_2 = require("../../common");
const entities_1 = require("../users/entities");
const utils_1 = require("../../utils");
let RoomService = class RoomService {
    constructor(roomModel, messageService, userService) {
        this.roomModel = roomModel;
        this.messageService = messageService;
        this.userService = userService;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.roomModel.countDocuments(conditions).exec()
            : this.roomModel.estimatedDocumentCount().exec();
    }
    async findAll(option, conditions = {}) {
        return this.roomModel
            .find(conditions)
            .sort(option.sort)
            .skip(option.skip)
            .limit(option.limit);
    }
    async findAllAndCount(option, conditions = {}) {
        const data = await this.findAll(option, conditions);
        const total = await this.count({ conditions });
        return { data, total };
    }
    async findById(id) {
        return await this.roomModel
            .findById(id)
            .populate({
            path: 'members',
        })
            .exec();
    }
    async findDmRoom(userIdA, userIdB) {
        const [userA, userB] = await Promise.all([userIdA, userIdB].map(async (userId) => {
            return await this.userService.findById(userId);
        }));
        const room = await this.roomModel
            .findOne({
            $or: [
                {
                    owner: userA,
                    members: userB,
                    isDm: true,
                },
                {
                    owner: userB,
                    members: userA,
                    isDm: true,
                },
            ],
        })
            .populate({
            path: 'members',
        })
            .exec();
        return room;
    }
    async getRoomByUser(user) {
        const response = await this.roomModel
            .find({
            $or: [
                {
                    owner: user,
                },
                {
                    members: user,
                },
            ],
        })
            .populate({
            path: 'members',
        })
            .exec();
        return response;
    }
    async getDMRoomOfUser(userAId, userBId) {
        const [userA, userB] = await Promise.all([userAId, userBId].map(async (userId) => {
            return await this.userService.findById(userId);
        }));
        const room = await this.roomModel
            .findOne({
            $or: [
                {
                    owner: userA,
                    members: userB,
                    isDm: true,
                },
                {
                    owner: userB,
                    members: userA,
                    isDm: true,
                },
            ],
        })
            .exec();
        if (!room) {
            return (0, utils_1.ResponseMessage)(`Room not found!`, 'BAD_REQUEST');
        }
        return room;
    }
    async createRoom(roomDto) {
        const { members = [] } = roomDto;
        const usersLists = await Promise.all(members.map(async (userId) => {
            return await this.userService.findById(userId);
        }));
        if ((usersLists === null || usersLists === void 0 ? void 0 : usersLists.length) > 0) {
            const newRoomObj = {
                name: roomDto.name || '',
                description: roomDto.description || '',
                image: roomDto.image || '',
                owner: usersLists[0],
                members: usersLists,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDm: members.length === 2,
            };
            const room = await this.roomModel
                .findOne({
                members: usersLists,
            })
                .lean();
            if (room) {
                return (0, utils_1.ResponseMessage)(`Room already exist!`, 'BAD_REQUEST');
            }
            const newRoom = new this.roomModel(newRoomObj);
            const newRoomDb = await newRoom.save();
            return newRoomDb;
        }
        return (0, utils_1.ResponseMessage)(`Users not found!`, 'NOT_FOUND');
    }
    async addMember(roomID, user) {
        const room = await this.findById(roomID);
        if (!room) {
            return (0, utils_1.ResponseMessage)(`Room not found!`, 'NOT_FOUND');
        }
        const isInRoom = room.members.find((e) => e.username === user.username);
        if (isInRoom) {
            return (0, utils_1.ResponseMessage)(`User's already in room!`, 'BAD_REQUEST');
        }
        const roomMembers = (0, utils_1.removeDuplicateObjectInArray)([
            ...room.members,
            user._id,
        ]);
        room.members = roomMembers;
        await room.save();
    }
    async deleteRoom(id, user) {
        const room = await this.findById(id);
        if (!room) {
            return (0, utils_1.ResponseMessage)(`Room with ${id} not found!`, 'NOT_FOUND');
        }
        if (room.owner._id.toString() !== user._id.toString()) {
            return (0, utils_1.ResponseMessage)(`You do not have right to delete this room!`, 'UNAUTHORIZED');
        }
        const deletedRooms = this.roomModel.findByIdAndDelete(id);
        const deletedMessage = this.messageService.deleteMessages(room._id);
        return await Promise.all([deletedMessage, deletedRooms]);
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(room_entity_1.Room.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => message_service_1.MessageService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        message_service_1.MessageService,
        users_service_1.UsersService])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map