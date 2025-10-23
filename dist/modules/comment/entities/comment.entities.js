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
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = exports.Comment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const entities_1 = require("../../tweet/entities");
const entities_2 = require("../../users/entities");
const mongoose_2 = require("mongoose");
let Comment = Comment_1 = class Comment {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, mongoose_1.Prop)(Date),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, mongoose_1.Prop)(Date),
    __metadata("design:type", Date)
], Comment.prototype, "modifiedAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Comment.prototype, "media", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: entities_1.Tweet.name,
    }),
    __metadata("design:type", Object)
], Comment.prototype, "tweet", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: entities_2.User.name,
    }),
    __metadata("design:type", Object)
], Comment.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Comment.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: Comment_1.name }] }),
    __metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
__decorate([
    (0, mongoose_1.Prop)(Boolean),
    __metadata("design:type", Boolean)
], Comment.prototype, "isChild", void 0);
Comment = Comment_1 = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'comments',
    })
], Comment);
exports.Comment = Comment;
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(Comment);
//# sourceMappingURL=comment.entities.js.map