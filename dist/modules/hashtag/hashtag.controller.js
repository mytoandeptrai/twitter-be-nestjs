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
exports.HashtagController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tools_1 = require("../../tools");
const constants_1 = require("./constants");
const dto_1 = require("./dto");
const hashtag_service_1 = require("./hashtag.service");
let HashtagController = class HashtagController {
    async getMostPopularHashtags() {
        const popularHashtags = await this.hashtagService.getMostPopularHashtags(constants_1.POPULAR_HASH_TAGS_NUMBER);
        return tools_1.ResponseTool.GET_OK(popularHashtags);
    }
    async updateHashtag(body, name) {
        const count = parseInt(body.count);
        const updatedHashtag = await this.hashtagService.updateHashtag(count, name);
        return tools_1.ResponseTool.PATCH_OK(updatedHashtag);
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", hashtag_service_1.HashtagService)
], HashtagController.prototype, "hashtagService", void 0);
__decorate([
    (0, common_1.Get)('/most-popular'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HashtagController.prototype, "getMostPopularHashtags", null);
__decorate([
    (0, common_1.Patch)('/:name'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateHashtagDto, String]),
    __metadata("design:returntype", Promise)
], HashtagController.prototype, "updateHashtag", null);
HashtagController = __decorate([
    (0, common_1.Controller)('hashtag'),
    (0, swagger_1.ApiTags)('HashTags')
], HashtagController);
exports.HashtagController = HashtagController;
//# sourceMappingURL=hashtag.controller.js.map