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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const tools_1 = require("../../tools");
const dto_1 = require("./dto");
const upload_service_1 = require("./upload.service");
const constants_1 = require("./constants");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    uploadMedias(files, meta) {
        return this.uploadService.uploadMedias(files, meta);
    }
    uploadMedia(image, meta) {
        return this.uploadService.uploadMedias([image], meta);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', constants_1.MAXIMUM_COUNT_FILES, tools_1.UploadTool.imageUpload)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, dto_1.UploadMetaInput]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMedias", null);
__decorate([
    (0, common_1.Post)('/image'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', tools_1.UploadTool.imageUpload)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UploadMetaInput]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadMedia", null);
UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    (0, swagger_1.ApiTags)('Upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map