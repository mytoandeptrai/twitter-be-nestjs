"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../../constants");
const auth_module_1 = require("../auth/auth.module");
const entities_1 = require("../message/entities");
const message_module_1 = require("../message/message.module");
const room_module_1 = require("../room/room.module");
const users_module_1 = require("../users/users.module");
const chat_gateway_1 = require("./chat.gateway");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Message', schema: entities_1.MessageSchema }]),
            jwt_1.JwtModule.register({
                global: true,
                secret: constants_1.JWT_SECRET,
                signOptions: {
                    expiresIn: constants_1.JWT_EXP,
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            message_module_1.MessageModule,
            room_module_1.RoomModule,
        ],
        controllers: [],
        providers: [chat_gateway_1.ChatGateway],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map