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
exports.StoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("../../common");
const constants_1 = require("../../constants");
const entities_1 = require("../users/entities");
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const entities_2 = require("./entities");
const constants_2 = require("./constants");
const utils_1 = require("../../utils");
let StoryService = class StoryService {
    constructor(storyModel) {
        this.storyModel = storyModel;
    }
    async findAll(option, conditions = {}) {
        const results = await this.storyModel
            .find(conditions)
            .sort(option.sort)
            .skip(option.skip)
            .limit(option.limit)
            .populate('owner', '_id name avatar');
        return results;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.storyModel.countDocuments(conditions).exec()
            : this.storyModel.estimatedDocumentCount().exec();
    }
    async findAllAndCount(option, conditions = {}) {
        const response = this.findAll(option, conditions);
        const count = this.count({ conditions });
        const [data, total] = await Promise.all([response, count]);
        return { data, total };
    }
    async findStory(id) {
        return await this.storyModel.findById(id).exec();
    }
    async getStories(user, query) {
        const currentTime = new Date();
        const yesterday = new Date(currentTime.getTime() - constants_2.ONE_DAY_HOURS);
        const following = user.following;
        const audienceConditions = [{ audience: constants_1.EAudienceConstant.PUBLIC }];
        if (user && following.length > 0) {
            const followingConditions = {
                audience: constants_1.EAudienceConstant.FOLLOWERS,
                owner: { $in: following },
            };
            audienceConditions.push(followingConditions);
        }
        if (user) {
            audienceConditions.push({ owner: user });
        }
        const timeCondition = { createdAt: { $gte: yesterday } };
        const conditions = Object.assign({ $or: audienceConditions }, timeCondition);
        return this.findAll(query, conditions);
    }
    async getMeStories(user, query) {
        const conditions = {
            owner: user,
        };
        return this.findAll(query, conditions);
    }
    async createStory(createStoryDto, user) {
        try {
            const story = new this.storyModel(createStoryDto);
            story.audience = createStoryDto.audience;
            story.owner = user;
            story.createdAt = new Date();
            const newStory = await story.save();
            return newStory;
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`Server Error`, 'SERVICE_UNAVAILABLE');
        }
    }
    async updateStory(id, user) {
        const userId = user._id;
        const story = await this.storyModel.findById(id);
        if (!story) {
            return (0, utils_1.ResponseMessage)(`The story is not found`, 'BAD_REQUEST');
        }
        if (!story.viewerIds.some((v) => v.toString() === userId.toString())) {
            story.viewerIds.push(userId);
            return await story.save();
        }
    }
    async deleteStory(id, user) {
        const story = await this.storyModel.findById(id);
        if (!story) {
            return (0, utils_1.ResponseMessage)(`The story is not found`, 'BAD_REQUEST');
        }
        if (story.owner.toString() !== user._id.toString()) {
            return (0, utils_1.ResponseMessage)(`You are not the owner of this story`, 'BAD_REQUEST');
        }
        return await this.storyModel.findByIdAndDelete(id);
    }
};
StoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_2.Story.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StoryService);
exports.StoryService = StoryService;
//# sourceMappingURL=story.service.js.map