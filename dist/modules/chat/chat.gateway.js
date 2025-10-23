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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const constants_1 = require("../../constants");
const message_service_1 = require("../message/message.service");
const room_service_1 = require("../room/room.service");
const socket_io_1 = require("socket.io");
const room_entity_1 = require("../room/entities/room.entity");
const entities_1 = require("../users/entities");
const auth_service_1 = require("../auth/auth.service");
const dto_1 = require("../room/dto");
let ChatGateway = class ChatGateway {
    constructor(roomService, messageService, authService) {
        this.roomService = roomService;
        this.messageService = messageService;
        this.authService = authService;
        this.room = [];
        this.callingRoom = {};
        this.connectedUsers = [];
        this.connectedRooms = [];
    }
    async getDMRoomId(roomId) {
        let room = null;
        room = await this.connectedRooms.find((r) => { var _a; return ((_a = r === null || r === void 0 ? void 0 : r._id) === null || _a === void 0 ? void 0 : _a.toString()) === roomId; });
        if (!room) {
            room = await this.roomService.findById(roomId);
            !!(room === null || room === void 0 ? void 0 : room._id) && this.connectedRooms.push(room);
        }
        return room;
    }
    async findRoom(memberIds) {
        if (memberIds.length === 1 || memberIds.length === 0) {
            return null;
        }
        let room = this.connectedRooms.find((rm) => {
            var _a;
            const roomMemberIds = ((_a = rm === null || rm === void 0 ? void 0 : rm.members) === null || _a === void 0 ? void 0 : _a.map((member) => member._id.toString())) ||
                [];
            return memberIds === null || memberIds === void 0 ? void 0 : memberIds.every((memberId) => roomMemberIds === null || roomMemberIds === void 0 ? void 0 : roomMemberIds.includes(memberId));
        });
        if (!room) {
            room = await this.roomService.findDmRoom(memberIds === null || memberIds === void 0 ? void 0 : memberIds[0], memberIds === null || memberIds === void 0 ? void 0 : memberIds[1]);
            (room === null || room === void 0 ? void 0 : room._id) && this.connectedRooms.push(room);
        }
        if (!room) {
            const newRoomDTO = {
                name: '',
                isDm: true,
                members: memberIds,
                isPrivate: true,
                description: '',
            };
            room = await this.roomService.createRoom(newRoomDTO);
            this.connectedRooms.push(room);
        }
        return room;
    }
    findConnectedUserById(userId) {
        if (userId) {
            return this.connectedUsers.find((user) => user._id.toString() === userId.toString());
        }
    }
    async handleMessage(socket, data) {
        console.log('message chat', data, socket.id);
    }
    async handleAddConnectedUser(socket, data) {
        const newUserId = data === null || data === void 0 ? void 0 : data._id;
        if (newUserId) {
            const existedUser = this.findConnectedUserById(newUserId);
            if (existedUser)
                return;
            this.connectedUsers.push(Object.assign(Object.assign({}, data), { socketId: socket.id, callingId: null }));
            this.server.emit('usersConnected', this.connectedUsers);
        }
    }
    async handleRemoveConnectedUser(socket, data) {
        const existedUserId = data === null || data === void 0 ? void 0 : data._id;
        if (existedUserId) {
            this.connectedUsers = this.connectedUsers.filter((user) => user._id !== existedUserId);
            this.server.emit('usersConnected', this.connectedUsers);
        }
    }
    async handleCreateNewMessage(socket, data) {
        var _a, _b;
        if (data) {
            const roomId = data.roomId;
            try {
                const existedRoom = await this.getDMRoomId(roomId);
                if (!existedRoom) {
                    return this.server
                        .to((_a = data === null || data === void 0 ? void 0 : data.author) === null || _a === void 0 ? void 0 : _a._id)
                        .emit('errorRoom', 'There is no existed room ');
                }
                const newMessage = await this.messageService.createMessage(data, existedRoom._id);
                existedRoom.members.forEach((mb) => {
                    const user = this.connectedUsers.find((e) => e._id.toString() === mb._id.toString());
                    if (user === null || user === void 0 ? void 0 : user.socketId) {
                        this.server.to(user.socketId).emit('newMessage', newMessage);
                    }
                });
            }
            catch (error) {
                this.server.to((_b = data === null || data === void 0 ? void 0 : data.author) === null || _b === void 0 ? void 0 : _b._id).emit('error', error);
            }
        }
    }
    async handleNewRoom(socket, body) {
        const { owner, members } = body;
        const ownerUser = this.findConnectedUserById(owner);
        if (ownerUser === null || ownerUser === void 0 ? void 0 : ownerUser.socketId) {
            const room = await this.findRoom(members);
            if (room) {
                this.server.to(ownerUser.socketId).emit('newDMRoom', room);
            }
        }
    }
    async handleCreateNotification(socket, body) {
        const receivers = (body === null || body === void 0 ? void 0 : body.receivers) || [];
        if (receivers.length === 0)
            return;
        receivers === null || receivers === void 0 ? void 0 : receivers.forEach((id) => {
            const user = this.connectedUsers.find((e) => e._id.toString() === id);
            if (user) {
                this.server.to(user.socketId).emit('newNotification', body);
            }
        });
    }
    async handleConnection(socket) {
        console.log('🚀 Client is connecting', socket.id);
    }
    async handleDisconnect(socket) {
        var _a;
        console.log('disconnect', socket.id, (_a = socket.data) === null || _a === void 0 ? void 0 : _a.email);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userOn'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAddConnectedUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userOff'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRemoveConnectedUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleCreateNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newDMRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleNewRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createNotification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleCreateNotification", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDisconnect", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(parseInt(constants_1.SOCKET_PORT), { cors: true }),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        message_service_1.MessageService,
        auth_service_1.AuthService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map