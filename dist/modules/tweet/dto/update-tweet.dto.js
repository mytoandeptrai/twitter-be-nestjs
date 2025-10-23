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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTweetDto = exports.EUpdateTweetType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../constants");
var EUpdateTweetType;
(function (EUpdateTweetType) {
    EUpdateTweetType["CONTENT"] = "content";
    EUpdateTweetType["RETWEET"] = "retweet";
    EUpdateTweetType["REACT"] = "react";
    EUpdateTweetType["SAVE"] = "save";
    EUpdateTweetType["SHARE"] = "share";
})(EUpdateTweetType = exports.EUpdateTweetType || (exports.EUpdateTweetType = {}));
class UpdateTweetDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'enum',
        enum: EUpdateTweetType,
    }),
    __metadata("design:type", String)
], UpdateTweetDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTweetDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        isArray: true,
        type: String,
    }),
    __metadata("design:type", Array)
], UpdateTweetDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        isArray: true,
        type: String,
    }),
    __metadata("design:type", Array)
], UpdateTweetDto.prototype, "media", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        type: 'enum',
        enum: Object.values(constants_1.EAudienceConstant),
    }),
    __metadata("design:type", Number)
], UpdateTweetDto.prototype, "audience", void 0);
exports.UpdateTweetDto = UpdateTweetDto;
//# sourceMappingURL=update-tweet.dto.js.map