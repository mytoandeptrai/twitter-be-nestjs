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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetSchema = exports.Tweet = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const entities_1 = require("../../users/entities");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../constants");
const constants_2 = require("../constants");
let Tweet = class Tweet {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Tweet.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tweet.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tweet.prototype, "media", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: entities_1.User.name,
    }),
    __metadata("design:type", Object)
], Tweet.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: entities_1.User.name }] }),
    __metadata("design:type", Array)
], Tweet.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: entities_1.User.name }] }),
    __metadata("design:type", Array)
], Tweet.prototype, "saved", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: entities_1.User.name }] }),
    __metadata("design:type", Array)
], Tweet.prototype, "retweeted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: entities_1.User.name }),
    __metadata("design:type", Object)
], Tweet.prototype, "retweetedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], Tweet.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], Tweet.prototype, "modifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        enum: Object.values(constants_1.EAudienceConstant),
    }),
    __metadata("design:type", Number)
], Tweet.prototype, "audience", void 0);
__decorate([
    (0, mongoose_1.Prop)(Boolean),
    __metadata("design:type", Boolean)
], Tweet.prototype, "isRetweet", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], Tweet.prototype, "reportedCount", void 0);
Tweet = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: constants_2.TWEET_MODEL,
        toJSON: { virtuals: true },
    })
], Tweet);
exports.Tweet = Tweet;
exports.TweetSchema = mongoose_1.SchemaFactory.createForClass(Tweet);
//# sourceMappingURL=tweet.entity.js.map