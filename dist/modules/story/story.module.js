"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const entities_1 = require("./entities");
const story_controller_1 = require("./story.controller");
const story_service_1 = require("./story.service");
let StoryModule = class StoryModule {
};
StoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: entities_1.Story.name, schema: entities_1.StorySchema }]),
        ],
        controllers: [story_controller_1.StoryController],
        providers: [story_service_1.StoryService],
        exports: [story_service_1.StoryService],
    })
], StoryModule);
exports.StoryModule = StoryModule;
//# sourceMappingURL=story.module.js.map