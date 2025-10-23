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
exports.TweetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const decorators_1 = require("../users/decorators");
const entities_1 = require("../users/entities");
const tools_1 = require("../../tools");
const dto_1 = require("./dto");
const tweet_service_1 = require("./tweet.service");
let TweetController = class TweetController {
    constructor(tweetService) {
        this.tweetService = tweetService;
    }
    async getTweetStatistics() {
        const statistics = await this.tweetService.getTweetStatistic();
        return tools_1.ResponseTool.GET_OK(statistics);
    }
    async getReportedTweets() {
        const data = await this.tweetService.getReportedTweets();
        return tools_1.ResponseTool.GET_OK(data);
    }
    async getMySavedTweets(user, query) {
        const { data, total } = await this.tweetService.getSavedTweets(user, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getTweetsByUser(user, userId, query) {
        const { data, total } = await this.tweetService.getTweetsByUser(userId, query.options, user);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getPopularTweets(user, query) {
        const { data, total } = await this.tweetService.getMostPopularTweets(user, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getLatestTweets(user, query) {
        const { data, total } = await this.tweetService.getLatestTweets(user, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getMedias(user, query) {
        const { data, total } = await this.tweetService.getMedias(user, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getTweetsByHashtag(user, name, query) {
        const { data, total } = await this.tweetService.getTweetsByHashTag(user, name, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getNewsFeedTweets(user, query) {
        const { data, total } = await this.tweetService.getPublicOrFollowersOnlyTweets(user, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getUserMedias(user, userId, query) {
        const { data, total } = await this.tweetService.getUserMedias(user, userId, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getTweet(user, tweetId) {
        const tweet = await this.tweetService.getTweet(tweetId, user);
        return tools_1.ResponseTool.GET_OK(tweet);
    }
    async getMyLikedTweets(userId, query) {
        const { data, total } = await this.tweetService.getLikedTweets(userId, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getCountByHashtag(name) {
        const count = await this.tweetService.countTweetByHashTag(name);
        return tools_1.ResponseTool.GET_OK(count);
    }
    async createTweet(user, createTweetDto) {
        const newTweet = await this.tweetService.createTweet(createTweetDto, user);
        return tools_1.ResponseTool.POST_OK(newTweet);
    }
    async updateTweet(user, tweetId, updatedData) {
        const updatedTweet = await this.tweetService.updateTweet(tweetId, updatedData, user);
        return tools_1.ResponseTool.PATCH_OK(updatedTweet);
    }
    async deleteTweetWithoutPermission(tweetId) {
        await this.tweetService.deleteTweetWithoutPermission(tweetId);
        return tools_1.ResponseTool.DELETE_OK({ message: 'Tweet deleted' });
    }
    async deleteTweet(user, tweetId) {
        await this.tweetService.deleteTweet(tweetId, user);
        return tools_1.ResponseTool.DELETE_OK({ message: 'Tweet deleted' });
    }
    async reportTweet(tweetId) {
        const tweet = await this.tweetService.reportTweet(tweetId);
        return tools_1.ResponseTool.PATCH_OK(tweet);
    }
    async reactToTweet(user, tweetId) {
        return tools_1.ResponseTool.POST_OK(await this.tweetService.reactTweet(tweetId, user));
    }
    async retweetTweet(user, tweetId) {
        return tools_1.ResponseTool.POST_OK(await this.tweetService.reTweet(tweetId, user));
    }
    async saveTweet(user, tweetId) {
        return tools_1.ResponseTool.POST_OK(await this.tweetService.saveTweet(tweetId, user));
    }
};
__decorate([
    (0, common_1.Get)('/tweet-statistic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getTweetStatistics", null);
__decorate([
    (0, common_1.Get)('/reportedTweet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getReportedTweets", null);
__decorate([
    (0, common_1.Get)('/user/saved'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getMySavedTweets", null);
__decorate([
    (0, common_1.Get)('/user/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getTweetsByUser", null);
__decorate([
    (0, common_1.Get)('/popular'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getPopularTweets", null);
__decorate([
    (0, common_1.Get)('/latest'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getLatestTweets", null);
__decorate([
    (0, common_1.Get)('/medias'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getMedias", null);
__decorate([
    (0, common_1.Get)('/hashtag/:name'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getTweetsByHashtag", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getNewsFeedTweets", null);
__decorate([
    (0, common_1.Get)('/user-medias/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getUserMedias", null);
__decorate([
    (0, common_1.Get)('/:tweetId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getTweet", null);
__decorate([
    (0, common_1.Get)('/liked/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getMyLikedTweets", null);
__decorate([
    (0, common_1.Get)('/count-by-hashtag/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getCountByHashtag", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateTweetDTO]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "createTweet", null);
__decorate([
    (0, common_1.Patch)('/:tweetId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateTweetDto]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "updateTweet", null);
__decorate([
    (0, common_1.Delete)('/:tweetId/without-permission'),
    __param(0, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "deleteTweetWithoutPermission", null);
__decorate([
    (0, common_1.Delete)('/:tweetId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "deleteTweet", null);
__decorate([
    (0, common_1.Patch)('/report/:tweetId'),
    __param(0, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "reportTweet", null);
__decorate([
    (0, common_1.Post)('/react/:tweetId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "reactToTweet", null);
__decorate([
    (0, common_1.Post)('/retweet/:tweetId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "retweetTweet", null);
__decorate([
    (0, common_1.Post)('/save/:tweetId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "saveTweet", null);
TweetController = __decorate([
    (0, common_1.Controller)('tweet'),
    (0, swagger_1.ApiTags)('Tweets'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tweet_service_1.TweetService])
], TweetController);
exports.TweetController = TweetController;
//# sourceMappingURL=tweet.controller.js.map