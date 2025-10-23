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
exports.LinkPreviewService = void 0;
const common_1 = require("@nestjs/common");
const html_metadata_parser_1 = require("html-metadata-parser");
const lru_cache_1 = require("lru-cache");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
let LinkPreviewService = class LinkPreviewService {
    constructor() {
        this.cache = new lru_cache_1.LRUCache(constants_1.options);
    }
    async getLinkMetadata(url) {
        if (!(0, utils_1.isValidUrl)(url)) {
            throw new common_1.BadRequestException('Invalid url');
        }
        const cached = this.cache.get(url);
        if (cached) {
            return (0, utils_1.parseJson)(cached);
        }
        const metadata = await (0, html_metadata_parser_1.parser)(url);
        this.cache.set(url, JSON.stringify(metadata));
        return metadata;
    }
};
LinkPreviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LinkPreviewService);
exports.LinkPreviewService = LinkPreviewService;
//# sourceMappingURL=link-preview.service.js.map