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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("../comment/comment.service");
const hashtag_service_1 = require("../hashtag/hashtag.service");
const tweet_service_1 = require("../tweet/tweet.service");
const entities_1 = require("../users/entities");
const users_service_1 = require("../users/users.service");
const tools_1 = require("../../tools");
const constants_1 = require("./constants");
let SearchService = class SearchService {
    constructor(usersService, tweetService, tagService, commentService) {
        this.usersService = usersService;
        this.tweetService = tweetService;
        this.tagService = tagService;
        this.commentService = commentService;
    }
    async search(user, searchQuery, query) {
        switch (searchQuery.category) {
            case constants_1.SEARCH_KEYS.TWEET:
                return this.tweetService.search(user, searchQuery.search, query);
            case constants_1.SEARCH_KEYS.PEOPLE:
                return this.usersService.search(searchQuery.search, query);
            case constants_1.SEARCH_KEYS.HASHTAG:
                return this.tagService.search(searchQuery.search, query);
            case constants_1.SEARCH_KEYS.COMMENT:
                return this.commentService.search(searchQuery.search, query);
            default:
                return {
                    data: [],
                    total: 0,
                };
        }
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        tweet_service_1.TweetService,
        hashtag_service_1.HashtagService,
        comment_service_1.CommentService])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map