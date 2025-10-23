"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const chat_module_1 = require("./modules/chat/chat.module");
const comment_module_1 = require("./modules/comment/comment.module");
const hashtag_module_1 = require("./modules/hashtag/hashtag.module");
const link_preview_module_1 = require("./modules/link-preview/link-preview.module");
const message_module_1 = require("./modules/message/message.module");
const notification_module_1 = require("./modules/notification/notification.module");
const room_module_1 = require("./modules/room/room.module");
const search_module_1 = require("./modules/search/search.module");
const story_module_1 = require("./modules/story/story.module");
const token_module_1 = require("./modules/token/token.module");
const tweet_module_1 = require("./modules/tweet/tweet.module");
const upload_module_1 = require("./modules/upload/upload.module");
const users_module_1 = require("./modules/users/users.module");
const helper_module_1 = require("./modules/helper/helper.module");
const constants_1 = require("./constants");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(constants_1.DATABASE_URL),
            config_1.ConfigModule.forRoot(),
            users_module_1.UsersModule,
            token_module_1.TokenModule,
            auth_module_1.AuthModule,
            upload_module_1.UploadModule,
            tweet_module_1.TweetModule,
            hashtag_module_1.HashtagModule,
            search_module_1.SearchModule,
            link_preview_module_1.LinkPreviewModule,
            story_module_1.StoryModule,
            comment_module_1.CommentModule,
            notification_module_1.NotificationModule,
            message_module_1.MessageModule,
            room_module_1.RoomModule,
            chat_module_1.ChatModule,
            helper_module_1.HelperModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map