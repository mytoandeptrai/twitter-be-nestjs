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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const decorators_1 = require("../users/decorators");
const entities_1 = require("../users/entities");
const tools_1 = require("../../tools");
const comment_service_1 = require("./comment.service");
const dto_1 = require("./dto");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async getCommentsByUser(user, query) {
        const { data, total } = await this.commentService.findCommentsByUser(user, query);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getCommentsByTweet(user, tweetId, query) {
        const { data, total } = await this.commentService.findCommentsByTweetId(tweetId, user, query);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async reactComment(user, commentId) {
        const reactComment = await this.commentService.reactComment(user, commentId);
        return tools_1.ResponseTool.PATCH_OK(reactComment);
    }
    async postComment(tweetId, user, commentDto) {
        const newComment = await this.commentService.createComment(commentDto, user, tweetId);
        return tools_1.ResponseTool.POST_OK(newComment);
    }
    async updateComment(commentId, user, commentDto) {
        const updatedComment = await this.commentService.updateComment(commentId, commentDto, user);
        return tools_1.ResponseTool.PATCH_OK(updatedComment);
    }
    async deleteComment(commentId, user) {
        await this.commentService.deleteComment(commentId, user);
        return tools_1.ResponseTool.DELETE_OK({
            message: 'OK',
        });
    }
};
__decorate([
    (0, common_1.Get)('/user'),
    (0, swagger_1.ApiResponse)({ type: common_2.ResponseDTO }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentsByUser", null);
__decorate([
    (0, common_1.Get)('/:tweetId'),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __param(2, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentsByTweet", null);
__decorate([
    (0, common_1.Patch)('/:commentId/react'),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "reactComment", null);
__decorate([
    (0, common_1.Post)('/:tweetId'),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, common_1.Param)('tweetId')),
    __param(1, (0, decorators_1.GetUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.CreateCommentDTO]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "postComment", null);
__decorate([
    (0, common_1.Patch)('/:commentId'),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, decorators_1.GetUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.CreateCommentDTO]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)('/:commentId'),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
CommentController = __decorate([
    (0, common_1.Controller)('comment'),
    (0, swagger_1.ApiTags)('Comments'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map