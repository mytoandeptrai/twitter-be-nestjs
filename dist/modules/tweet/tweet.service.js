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
exports.TweetService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("../../common");
const entities_1 = require("../users/entities");
const users_service_1 = require("../users/users.service");
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
const constants_2 = require("./constants");
const dto_1 = require("./dto");
const entities_2 = require("./entities");
const mongodb_1 = require("mongodb");
const comment_service_1 = require("../comment/comment.service");
let TweetService = class TweetService {
    constructor(tweetModel, usersService, commentService) {
        this.tweetModel = tweetModel;
        this.usersService = usersService;
        this.commentService = commentService;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.tweetModel.countDocuments(conditions).exec()
            : this.tweetModel.estimatedDocumentCount().exec();
    }
    isAdminRole(role) {
        return constants_1.ROOT_ROLES.includes(role);
    }
    getInformationFromTweet(tweet) {
        var _a, _b, _c, _d;
        const tweetAuthorId = ((_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.author) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        const isRetweet = (tweet === null || tweet === void 0 ? void 0 : tweet.isRetweet) || false;
        const retweetedById = (isRetweet && ((_d = (_c = tweet === null || tweet === void 0 ? void 0 : tweet.retweetedBy) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) || '';
        return {
            tweetAuthorId,
            isRetweet,
            retweetedById,
        };
    }
    getMediaAggregation() {
        return [
            {
                $addFields: {
                    media_count: { $size: { $ifNull: ['$media', []] } },
                    likes_count: { $size: { $ifNull: ['$likes', []] } },
                },
            },
            {
                $sort: {
                    likes_count: -1,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: '$author',
            },
        ];
    }
    async hasPermission(user, tweetId) {
        var _a;
        const userId = (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString();
        const currentTweet = await this.getTweet(tweetId, user);
        if (!currentTweet) {
            return (0, utils_1.ResponseMessage)('Tweet is not found', 'BAD_REQUEST');
        }
        const { isRetweet, retweetedById, tweetAuthorId } = this.getInformationFromTweet(currentTweet);
        if (userId === tweetAuthorId || (isRetweet && userId === retweetedById)) {
            return currentTweet;
        }
        return null;
    }
    async findAll(option, conditions = {}) {
        return this.tweetModel
            .find(conditions)
            .sort(option.sort)
            .select({ password: 0, passwordConfirm: 0 })
            .skip(option.skip)
            .limit(option.limit)
            .populate('author', '_id name avatar coverPhoto followers gender')
            .populate('retweetedBy', 'name avatar coverPhoto')
            .populate('likes', 'name avatar bio')
            .populate('retweeted', 'name avatar bio')
            .populate('saved', 'name avatar bio');
    }
    async findAllAndCount(option, conditions = {}) {
        const response = this.findAll(option, conditions);
        const count = this.count({ conditions });
        const [data, total] = await Promise.all([response, count]);
        return { data, total };
    }
    async createTweet(tweetDTO, user) {
        const tweet = new this.tweetModel(Object.assign(Object.assign({}, tweetDTO), { createdAt: new Date(), modifiedAt: new Date(), isRetweet: false }));
        tweet.author = user;
        try {
            const response = await tweet.save();
            return response;
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(error, 'SERVICE_UNAVAILABLE');
        }
    }
    async updateTweet(tweetId, updatedData, user) {
        const isAuthor = await this.hasPermission(user, tweetId);
        if (!isAuthor) {
            return (0, utils_1.ResponseMessage)('You have no permission to update this tweet', 'BAD_REQUEST');
        }
        const updateType = updatedData.type;
        switch (updateType) {
            case dto_1.EUpdateTweetType.REACT:
                return await this.reactTweet(tweetId, user);
            case dto_1.EUpdateTweetType.SAVE:
                return await this.saveTweet(tweetId, user);
            case dto_1.EUpdateTweetType.RETWEET:
                return await this.reTweet(tweetId, user);
            default:
                const response = await this.tweetModel
                    .findByIdAndUpdate(tweetId, updatedData, { new: true })
                    .exec();
                return response;
        }
    }
    async deleteTweet(id, user) {
        const tweet = await this.hasPermission(user, id);
        if (!tweet) {
            return (0, utils_1.ResponseMessage)('You have no permission to update this tweet', 'BAD_REQUEST');
        }
        this.commentService.deleteCommentByTweetId(id);
        await this.tweetModel.findByIdAndRemove(id).exec();
    }
    async deleteTweetWithoutPermission(tweetId) {
        try {
            return this.tweetModel.findByIdAndDelete(tweetId);
        }
        catch (error) {
            console.log(`error`, error);
        }
    }
    async deleteTweetsOfUserWithoutPermission(userId) {
        try {
            const user = await this.usersService.findByIdAdmin(userId);
            return this.tweetModel.deleteMany({ author: user });
        }
        catch (error) {
            console.log(`error`, error);
        }
    }
    async reactTweet(id, user) {
        var _a, _b;
        const tweet = await this.getTweet(id, user);
        if (!tweet) {
            return (0, utils_1.ResponseMessage)('Tweet is not found', 'BAD_REQUEST');
        }
        const tweetId = (_a = tweet === null || tweet === void 0 ? void 0 : tweet._id) === null || _a === void 0 ? void 0 : _a.toString();
        const userId = (_b = user === null || user === void 0 ? void 0 : user._id) === null || _b === void 0 ? void 0 : _b.toString();
        const didUserLiked = tweet.likes.some((userLiked) => { var _a; return ((_a = userLiked === null || userLiked === void 0 ? void 0 : userLiked._id) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
        const updateQuery = didUserLiked
            ? { $pull: { likes: userId } }
            : { $push: { likes: userId } };
        const newTweet = await this.tweetModel
            .findByIdAndUpdate(tweetId, updateQuery, { new: true })
            .exec();
        return newTweet;
    }
    async saveTweet(id, user) {
        var _a, _b;
        const userId = (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString();
        const tweet = await this.getTweet(id, user);
        if (!tweet) {
            return (0, utils_1.ResponseMessage)('Tweet is not found', 'BAD_REQUEST');
        }
        const tweetId = (_b = tweet === null || tweet === void 0 ? void 0 : tweet._id) === null || _b === void 0 ? void 0 : _b.toString();
        const existedSavedUser = tweet.saved.some((user) => { var _a; return ((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
        const updateQuery = existedSavedUser
            ? { $pull: { saved: userId } }
            : { $push: { saved: userId } };
        const newTweet = await this.tweetModel
            .findByIdAndUpdate(tweetId, updateQuery, { new: true })
            .exec();
        return newTweet;
    }
    async reTweet(id, user) {
        var _a;
        const userId = (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString();
        const tweet = await this.getTweet(id, user);
        if (!tweet) {
            return (0, utils_1.ResponseMessage)('Tweet is not found', 'BAD_REQUEST');
        }
        tweet.retweeted.push(userId);
        const newTweet = new this.tweetModel({
            author: tweet.author,
            content: tweet.content,
            audience: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isRetweet: true,
            likes: [],
            media: tweet.media,
            tags: tweet.tags,
            retweet: [],
            retweetedBy: user,
        });
        const [oldTweetData, newTweetData] = await Promise.all([
            tweet.save(),
            newTweet.save(),
        ]);
        return newTweetData;
    }
    async createTweetByUserId(userId, createTweetData) {
        const user = await this.usersService.findById(userId);
        if (user) {
            const tweet = await this.createTweet(createTweetData, user);
            return tweet;
        }
        return null;
    }
    async reportTweet(tweetId) {
        const tweet = await this.tweetModel.findById(tweetId);
        if (!tweet) {
            return (0, utils_1.ResponseMessage)('Tweet is not found', 'BAD_REQUEST');
        }
        tweet.reportedCount = +(tweet.reportedCount || 0) + 1;
        return await tweet.save();
    }
    async getTweet(id, user) {
        var _a, _b, _c, _d;
        const tweet = await this.tweetModel
            .findById(id)
            .populate('author', 'name avatar coverPhoto followers gender')
            .populate('retweetedBy', 'name avatar coverPhoto')
            .populate('likes', 'name avatar bio')
            .populate('retweeted', 'name avatar bio')
            .populate('saved', 'name avatar bio')
            .exec();
        const userId = ((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        const { isRetweet, retweetedById, tweetAuthorId } = this.getInformationFromTweet(tweet);
        if ((tweet === null || tweet === void 0 ? void 0 : tweet.audience) === constants_1.EAudienceConstant.PUBLIC)
            return tweet;
        if (!user || !tweetAuthorId)
            return null;
        if (this.isAdminRole(user.role)) {
            return tweet;
        }
        const tweetAudience = JSON.stringify(tweet === null || tweet === void 0 ? void 0 : tweet.audience);
        switch (tweetAudience) {
            case String(constants_1.EAudienceConstant.ONLY_ME):
                if (userId !== tweetAuthorId && isRetweet && userId !== retweetedById) {
                    return (0, utils_1.ResponseMessage)('You are not the author of this tweet', 'BAD_REQUEST');
                }
                return tweet;
            case String(constants_1.EAudienceConstant.FOLLOWERS): {
                if (userId === tweetAuthorId || this.isAdminRole(user.role)) {
                    return tweet;
                }
                if (!((_c = (_b = tweet === null || tweet === void 0 ? void 0 : tweet.author) === null || _b === void 0 ? void 0 : _b.followers) === null || _c === void 0 ? void 0 : _c.some((u) => u._id.toString() === userId)) &&
                    !((_d = user === null || user === void 0 ? void 0 : user.following) === null || _d === void 0 ? void 0 : _d.includes(tweetAuthorId))) {
                    return (0, utils_1.ResponseMessage)('You are not following the author of this tweet', 'BAD_REQUEST');
                }
                return tweet;
            }
            default:
                return null;
        }
    }
    async getTweetById(id) {
        return this.tweetModel.findById(id).lean();
    }
    async getPublicOrFollowersOnlyTweets(user, option) {
        const following = user.following;
        const hasUser = user ? { author: user } : {};
        const isFollowers = ((following === null || following === void 0 ? void 0 : following.length) > 0 && {
            author: { $in: following },
            audience: constants_1.EAudienceConstant.FOLLOWERS,
        }) ||
            {};
        const conditions = {
            $or: [
                {
                    audience: constants_1.EAudienceConstant.PUBLIC,
                },
                ...[isFollowers],
                ...[hasUser],
            ],
        };
        return this.findAllAndCount(option, conditions);
    }
    async getTweetsByUser(userId, option, userRequest) {
        var _a, _b;
        const user = await this.usersService.findById(userId);
        const isUserRequestFollowingUser = (_a = userRequest === null || userRequest === void 0 ? void 0 : userRequest.following) === null || _a === void 0 ? void 0 : _a.some((u) => u._id.toString() === userId);
        let conditions = {
            author: user,
            audience: constants_1.EAudienceConstant.PUBLIC,
        };
        const userInDbId = user._id.toString();
        const userRequestId = (_b = userRequest === null || userRequest === void 0 ? void 0 : userRequest._id) === null || _b === void 0 ? void 0 : _b.toString();
        if (userInDbId === userRequestId || isUserRequestFollowingUser) {
            conditions = {
                $or: [{ author: user, isRetweet: false }, { retweetedBy: user }],
            };
        }
        return this.findAllAndCount(option, conditions);
    }
    async getLatestTweets(user, option) {
        const following = user.following;
        const orConditions = [
            {
                audience: constants_1.EAudienceConstant.PUBLIC,
            },
        ];
        if (following.length > 0) {
            const followingTweet = {
                author: { $in: following },
            };
            orConditions.push(followingTweet);
        }
        if (user) {
            const userTweet = {
                author: user,
            };
            orConditions.push(userTweet);
        }
        const conditions = {
            $or: orConditions,
        };
        option.sort = Object.assign(Object.assign({}, option.sort), { modifiedAt: -1 });
        return this.findAllAndCount(option, conditions);
    }
    async getMostPopularTweets(user, option) {
        const following = user.following;
        const conditions = {
            $or: [
                { audience: 0 },
                ...(((user === null || user === void 0 ? void 0 : user._id) && [{ author: { $in: following } }]) || []),
            ],
        };
        const data = await this.tweetModel
            .aggregate([
            {
                $addFields: {
                    likes_count: { $size: { $ifNull: ['$likes', []] } },
                },
            },
            {
                $sort: { likes_count: -1 },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: '$author',
            },
            {
                $match: conditions,
            },
        ])
            .skip(option.skip)
            .limit(option.limit)
            .exec();
        await this.tweetModel.populate(data, {
            path: 'retweetedBy',
            select: '_id name',
        });
        const total = await this.tweetModel.countDocuments(conditions);
        return { data, total };
    }
    async getSavedTweets(user, option) {
        const conditions = {
            saved: user._id,
        };
        return this.findAllAndCount(option, conditions);
    }
    async getLikedTweets(userId, option) {
        const user = await this.usersService.findById(userId);
        const conditions = {
            likes: user._id,
        };
        return this.findAllAndCount(option, conditions);
    }
    async getMostLikedTweets() {
        const data = await this.tweetModel
            .aggregate([
            {
                $addFields: {
                    likes_count: { $size: { $ifNull: ['$likes', []] } },
                },
            },
            {
                $sort: { likes_count: -1 },
            },
        ])
            .skip(constants_2.TWEET_SKIP_DEFAULT)
            .limit(constants_2.TWEET_LIMIT_DEFAULT)
            .exec();
        return data;
    }
    async getMostSavedTweets() {
        const data = await this.tweetModel
            .aggregate([
            {
                $addFields: {
                    saved_count: {
                        $size: { $ifNull: ['$saved', []] },
                    },
                },
            },
            {
                $sort: { saved_count: -1 },
            },
        ])
            .skip(constants_2.TWEET_SKIP_DEFAULT)
            .limit(constants_2.TWEET_LIMIT_DEFAULT)
            .exec();
        return data;
    }
    async getMostRetweetedTweets() {
        const data = await this.tweetModel
            .aggregate([
            {
                $addFields: {
                    retweeted_count: {
                        $size: { $ifNull: ['$retweeted', []] },
                    },
                },
            },
            {
                $sort: { retweeted_count: -1 },
            },
        ])
            .skip(constants_2.TWEET_SKIP_DEFAULT)
            .limit(constants_2.TWEET_LIMIT_DEFAULT)
            .exec();
        return data;
    }
    async getTweetStatistic() {
        const [mostLikedTweets, mostSavedTweets, mostRetweetedTweets] = await Promise.all([
            this.getMostLikedTweets(),
            this.getMostSavedTweets(),
            this.getMostRetweetedTweets(),
        ]).catch((error) => {
            return [[], [], []];
        });
        const data = {
            mostLikedTweets,
            mostSavedTweets,
            mostRetweetedTweets,
        };
        return data;
    }
    async search(user, search, query) {
        const conditions = {
            content: { $regex: search, $options: 'i' },
            $or: [
                {
                    audience: constants_1.EAudienceConstant.PUBLIC,
                },
                {
                    author: { $in: user.following },
                },
                {
                    author: user,
                },
            ],
        };
        return this.findAllAndCount(query.options, conditions);
    }
    async getTweetsByHashTag(user, hashTag, option) {
        const following = user.following;
        const conditions = {
            $and: [
                {
                    $or: [
                        { audience: 0 },
                        { author: { $in: following } },
                        { author: user },
                    ],
                },
                { tags: { $in: hashTag } },
            ],
        };
        return this.findAllAndCount(option, conditions);
    }
    async getReportedTweets() {
        const conditions = {
            reportedCount: { $gt: 0 },
        };
        return this.tweetModel
            .find(conditions)
            .populate('author', '_id name')
            .exec();
    }
    async getUserMedias(userParam, userId, option) {
        var _a;
        const isSameUser = ((_a = userParam === null || userParam === void 0 ? void 0 : userParam._id) === null || _a === void 0 ? void 0 : _a.toString()) === userId;
        const user = isSameUser
            ? Object.assign({}, userParam) : await this.usersService.findById(userId);
        const following = user.following;
        const conditions = {
            author: new mongodb_1.ObjectId(userId),
            audience: isSameUser
                ? { $in: Object.values(constants_1.EAudienceConstant) }
                : {
                    $in: [constants_1.EAudienceConstant.PUBLIC],
                },
        };
        if (!isSameUser) {
            const isUserFollowing = following === null || following === void 0 ? void 0 : following.some((us) => { var _a; return ((_a = us === null || us === void 0 ? void 0 : us._id) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
            conditions.audience = isUserFollowing
                ? { $in: [constants_1.EAudienceConstant.PUBLIC, constants_1.EAudienceConstant.FOLLOWERS] }
                : { $in: [constants_1.EAudienceConstant.PUBLIC] };
        }
        const aggregation = [
            {
                $match: conditions,
            },
            ...this.getMediaAggregation(),
            {
                $match: {
                    media_count: { $gt: 0 },
                },
            },
        ];
        const [data, [{ total = 0 } = {}] = []] = await Promise.all([
            this.tweetModel
                .aggregate(aggregation)
                .skip(option.skip)
                .limit(option.limit)
                .exec(),
            this.tweetModel
                .aggregate([
                ...aggregation,
                {
                    $count: 'total',
                },
            ])
                .exec(),
        ]);
        return { data, total };
    }
    async getMedias(user, option) {
        var _a;
        const following = user.following;
        const conditions = {
            $or: [
                { audience: 0 },
                ...(((user === null || user === void 0 ? void 0 : user._id) && [{ author: { $in: following } }, { author: user }]) ||
                    []),
            ],
        };
        const aggregation = [
            {
                $match: conditions,
            },
            ...this.getMediaAggregation(),
            {
                $match: {
                    media_count: { $gt: 0 },
                },
            },
        ];
        const data = await this.tweetModel
            .aggregate(aggregation)
            .skip(option.skip)
            .limit(option.limit)
            .exec();
        await this.tweetModel.populate(data, {
            path: 'retweetedBy',
            select: '_id name',
        });
        const dataTotal = await this.tweetModel
            .aggregate([
            ...aggregation,
            {
                $count: 'total',
            },
        ])
            .exec();
        const total = ((_a = dataTotal === null || dataTotal === void 0 ? void 0 : dataTotal[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        return { data, total };
    }
    async countTweetByHashTag(hashTag) {
        const conditions = {
            tags: hashTag,
        };
        return this.tweetModel.countDocuments(conditions).exec();
    }
    async countTweetByUser(userId) {
        const user = await this.usersService.findById(userId);
        const conditions = {
            author: user,
        };
        return this.tweetModel.countDocuments(conditions).exec();
    }
};
TweetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_2.Tweet.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => comment_service_1.CommentService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        comment_service_1.CommentService])
], TweetService);
exports.TweetService = TweetService;
//# sourceMappingURL=tweet.service.js.map