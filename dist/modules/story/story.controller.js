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
exports.StoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const decorators_1 = require("../users/decorators");
const entities_1 = require("../users/entities");
const tools_1 = require("../../tools");
const dto_1 = require("./dto");
const story_service_1 = require("./story.service");
let StoryController = class StoryController {
    constructor(storyService) {
        this.storyService = storyService;
    }
    async createStory(user, createStoryDto) {
        const newStory = await this.storyService.createStory(createStoryDto, user);
        return tools_1.ResponseTool.POST_OK(newStory);
    }
    async getStories(user, query) {
        const stories = await this.storyService.getStories(user, query.options);
        return tools_1.ResponseTool.GET_OK(stories);
    }
    async getMeStories(user, query) {
        const stories = await this.storyService.getMeStories(user, query.options);
        return tools_1.ResponseTool.GET_OK(stories);
    }
    async updateStory(user, id) {
        const updatedStory = await this.storyService.updateStory(id, user);
        return tools_1.ResponseTool.PATCH_OK(updatedStory);
    }
    async deleteStory(user, id) {
        const deletedStory = await this.storyService.deleteStory(id, user);
        return tools_1.ResponseTool.DELETE_OK(deletedStory);
    }
};
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiResponse)({
        type: common_2.ResponseDTO,
    }),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.StoryDTO]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "createStory", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getStories", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getMeStories", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "updateStory", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "deleteStory", null);
StoryController = __decorate([
    (0, swagger_1.ApiTags)('Story'),
    (0, common_1.Controller)('story'),
    __metadata("design:paramtypes", [story_service_1.StoryService])
], StoryController);
exports.StoryController = StoryController;
//# sourceMappingURL=story.controller.js.map