"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashtagModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const entities_1 = require("./entities");
const hashtag_controller_1 = require("./hashtag.controller");
const hashtag_service_1 = require("./hashtag.service");
let HashtagModule = class HashtagModule {
};
HashtagModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: entities_1.Hashtag.name,
                    schema: entities_1.HashtagSchema,
                },
            ]),
        ],
        providers: [hashtag_service_1.HashtagService],
        exports: [hashtag_service_1.HashtagService],
        controllers: [hashtag_controller_1.HashtagController],
    })
], HashtagModule);
exports.HashtagModule = HashtagModule;
//# sourceMappingURL=hashtag.module.js.map