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
exports.LinkPreviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const tools_1 = require("../../tools");
const link_preview_service_1 = require("./link-preview.service");
let LinkPreviewController = class LinkPreviewController {
    async getLinkMetadata(url) {
        const metadata = await this.linkPreviewService.getLinkMetadata(url);
        return tools_1.ResponseTool.GET_OK(metadata);
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", link_preview_service_1.LinkPreviewService)
], LinkPreviewController.prototype, "linkPreviewService", void 0);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, common_1.Query)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LinkPreviewController.prototype, "getLinkMetadata", null);
LinkPreviewController = __decorate([
    (0, swagger_1.ApiTags)('Link-preview'),
    (0, common_1.Controller)('link-preview')
], LinkPreviewController);
exports.LinkPreviewController = LinkPreviewController;
//# sourceMappingURL=link-preview.controller.js.map