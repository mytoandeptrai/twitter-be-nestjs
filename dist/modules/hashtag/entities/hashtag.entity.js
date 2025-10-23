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
exports.HashtagSchema = exports.Hashtag = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../constants");
let Hashtag = class Hashtag {
};
__decorate([
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Hashtag.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(Number),
    __metadata("design:type", Number)
], Hashtag.prototype, "count", void 0);
Hashtag = __decorate([
    (0, mongoose_1.Schema)({
        collection: constants_1.HASH_TAGS_MODEL,
    })
], Hashtag);
exports.Hashtag = Hashtag;
exports.HashtagSchema = mongoose_1.SchemaFactory.createForClass(Hashtag);
//# sourceMappingURL=hashtag.entity.js.map