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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorySchema = exports.Story = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const entities_1 = require("../../users/entities");
const mongoose = __importStar(require("mongoose"));
const constants_1 = require("../../../constants");
const constants_2 = require("../constants");
let Story = class Story {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Story.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Story.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, mongoose_1.Prop)({
        type: Number,
        enum: Object.values(constants_1.EAudienceConstant),
        default: constants_1.EAudienceConstant.PUBLIC,
    }),
    __metadata("design:type", Number)
], Story.prototype, "audience", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: entities_1.User.name }),
    __metadata("design:type", Object)
], Story.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Story.prototype, "viewerIds", void 0);
__decorate([
    (0, mongoose_1.Prop)(Date),
    __metadata("design:type", Date)
], Story.prototype, "createdAt", void 0);
Story = __decorate([
    (0, mongoose_1.Schema)({
        collection: constants_2.STORY_MODEL,
        toJSON: {
            virtuals: true,
        },
    })
], Story);
exports.Story = Story;
exports.StorySchema = mongoose_1.SchemaFactory.createForClass(Story);
//# sourceMappingURL=story.entity.js.map