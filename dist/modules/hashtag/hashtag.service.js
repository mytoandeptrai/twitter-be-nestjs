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
exports.HashtagService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("../../common");
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const entities_1 = require("./entities");
let HashtagService = class HashtagService {
    constructor(hashtagModel) {
        this.hashtagModel = hashtagModel;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.hashtagModel.countDocuments(conditions).exec()
            : this.hashtagModel.estimatedDocumentCount().exec();
    }
    async findAll(option, conditions = {}) {
        return this.hashtagModel
            .find(conditions)
            .sort(option.sort)
            .skip(option.skip)
            .limit(option.limit);
    }
    async getMostPopularHashtags(limit) {
        return await this.hashtagModel
            .find({
            count: { $gt: 0 },
        })
            .sort({ count: -1 })
            .limit(limit);
    }
    async findAllAndCount(option, conditions = {}) {
        const data = await this.findAll(option, conditions);
        const total = await this.count({ conditions });
        return { data, total };
    }
    async search(search, query) {
        const conditions = {
            name: { $regex: search, $options: 'i' },
            count: { $gt: 0 },
        };
        return this.findAllAndCount(query.options, conditions);
    }
    async updateHashtag(count, hashtag) {
        const hashtagDoc = await this.hashtagModel.findOne({
            name: hashtag,
        });
        if (!hashtagDoc) {
            return this.hashtagModel.create({
                name: hashtag,
                count,
            });
        }
        hashtagDoc.count += count;
        return await hashtagDoc.save();
    }
};
HashtagService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_1.Hashtag.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HashtagService);
exports.HashtagService = HashtagService;
//# sourceMappingURL=hashtag.service.js.map