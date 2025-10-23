"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("../../common");
const tweet_service_1 = require("../tweet/tweet.service");
const entities_1 = require("../users/entities");
const mongoose_2 = __importStar(require("mongoose"));
const tools_1 = require("../../tools");
const utils_1 = require("../../utils");
const entities_2 = require("./entities");
let CommentService = class CommentService {
    constructor(commentModel, tweetService, connection) {
        this.commentModel = commentModel;
        this.tweetService = tweetService;
        this.connection = connection;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.commentModel.countDocuments(conditions).exec()
            : this.commentModel.estimatedDocumentCount().exec();
    }
    async findAll(option, conditions = {}) {
        return this.commentModel
            .find(conditions)
            .sort(option.sort)
            .skip(option.skip)
            .limit(option.limit)
            .populate('author', 'name avatar coverPhoto')
            .populate('tweet', '_id')
            .sort({
            createdAt: -1,
        })
            .populate({
            path: 'replies',
            populate: {
                path: 'author',
                select: '_id name avatar coverPhoto',
            },
        });
    }
    async findAllAndCount(option, conditions = {}) {
        const data = await this.findAll(option, conditions);
        const total = await this.count({ conditions });
        return { data, total };
    }
    async getCommentById(commentId) {
        try {
            const comment = await this.commentModel.findById(commentId);
            return comment;
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
    async findCommentsByTweetId(tweetId, user, query) {
        try {
            const tweet = await this.tweetService.getTweet(tweetId, user);
            if (!tweet) {
                return (0, utils_1.ResponseMessage)('Tweet not found', 'BAD_REQUEST');
            }
            const conditions = {
                tweet: tweetId,
                isChild: false,
            };
            return this.findAllAndCount(query.options, conditions);
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
    async findCommentsByUser(user, query) {
        try {
            const conditions = {
                author: user._id,
            };
            return this.findAllAndCount(query.options, conditions);
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
    async search(search, query) {
        const conditions = {
            content: { $regex: search, $options: 'i' },
        };
        return this.findAllAndCount(query.options, conditions);
    }
    async createComment(createCommentDto, user, tweetId) {
        let tweet = await this.tweetService.getTweet(tweetId, user);
        let parentComment;
        if (!tweet) {
            parentComment = await this.getCommentById(tweetId);
            if (!parentComment) {
                return (0, utils_1.ResponseMessage)('Comment not found', 'BAD_REQUEST');
            }
            tweet = parentComment.tweet;
        }
        const newComment = new this.commentModel(Object.assign(Object.assign({}, createCommentDto), { isEdited: false, tweet: tweet, author: user, modifiedAt: new Date(), createdAt: new Date(), isChild: !!parentComment, likes: [] }));
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const comment = await newComment.save();
            if (parentComment) {
                parentComment.replies.push(comment);
                await parentComment.save();
            }
            await session.commitTransaction();
            session.endSession();
            return comment;
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
    async updateComment(commentId, updateCommentDto, user) {
        const updatedComment = Object.assign({}, updateCommentDto);
        const comment = await this.getCommentById(commentId);
        if (!comment) {
            return (0, utils_1.ResponseMessage)('Comment not found', 'BAD_REQUEST');
        }
        if (comment.author.username !== user.username) {
            return (0, utils_1.ResponseMessage)('You are not allowed to update this comment', 'BAD_REQUEST');
        }
        updatedComment.modifiedAt = new Date();
        updatedComment.isEdited = true;
        try {
            const comment = await this.commentModel.findByIdAndUpdate(commentId, updateCommentDto, { new: true });
            return comment;
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
    async deleteComment(commentId, user) {
        const comment = await this.getCommentById(commentId);
        if (!comment) {
            return (0, utils_1.ResponseMessage)('Comment not found', 'BAD_REQUEST');
        }
        if (comment.author.username !== user.username) {
            return (0, utils_1.ResponseMessage)('You are not allowed to update this comment', 'BAD_REQUEST');
        }
        try {
            if (!!comment.replies.length) {
                await this.commentModel
                    .deleteMany({
                    _id: { $in: comment.replies },
                })
                    .lean();
            }
            await this.commentModel.findByIdAndDelete(commentId).lean();
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
    async deleteCommentByTweetId(tweetId) {
        const tweet = await this.tweetService.getTweetById(tweetId);
        await this.commentModel.deleteMany({ tweet });
    }
    async reactComment(user, commentId) {
        try {
            const comment = await this.getCommentById(commentId);
            if (!comment) {
                return (0, utils_1.ResponseMessage)('Comment not found', 'BAD_REQUEST');
            }
            const userIdStr = user._id.toString();
            const userLikedIndex = comment.likes.findIndex((userId) => userId.toString() === userIdStr);
            if (userLikedIndex !== -1) {
                comment.likes.splice(userLikedIndex, 1);
            }
            else {
                comment.likes.push(user._id);
            }
            const response = await comment.save();
            return response;
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error === null || error === void 0 ? void 0 : error.message}`, 'BAD_REQUEST');
        }
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_2.Comment.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => tweet_service_1.TweetService))),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        tweet_service_1.TweetService, mongoose_2.default.Connection])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map