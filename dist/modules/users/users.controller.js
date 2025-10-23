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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const tools_1 = require("../../tools");
const decorators_1 = require("./decorators");
const dto_1 = require("./dto");
const entities_1 = require("./entities");
const users_service_1 = require("./users.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(user) {
        return tools_1.ResponseTool.CREATED(await this.userService.createUser(user));
    }
    async followUser(user, userToFollowId) {
        return tools_1.ResponseTool.POST_OK(await this.userService.followUser(user, userToFollowId));
    }
    async unFollowUser(user, userToUnFollowId) {
        return tools_1.ResponseTool.POST_OK(await this.userService.unFollowUser(user, userToUnFollowId));
    }
    async followAnonymous(body) {
        return tools_1.ResponseTool.POST_OK(await this.userService.followAnonymous(body));
    }
    async updateMyProfile(oldUser, newUserInfo) {
        return tools_1.ResponseTool.PATCH_OK(await this.userService.updateUser(oldUser._id, newUserInfo));
    }
    async updateBanStatusOfUser(requestUser, body, userId) {
        return tools_1.ResponseTool.PATCH_OK(await this.userService.updateBanStatusOfUser(requestUser, body.status, userId));
    }
    async updateUserById(requestUser, userInfo, userId) {
        return tools_1.ResponseTool.PATCH_OK(await this.userService.updateUserById(userId, userInfo, requestUser));
    }
    async reportTweet(userId) {
        const user = await this.userService.reportUser(userId);
        return tools_1.ResponseTool.PATCH_OK(user);
    }
    async getUsers(query) {
        return tools_1.ResponseTool.GET_OK(await this.userService.getUserList(query));
    }
    async getMyProfile(user) {
        return tools_1.ResponseTool.GET_OK(user);
    }
    async getPopularUsers(user, query) {
        const { data, total } = await this.userService.getPopularUsers(user, query.options);
        return tools_1.ResponseTool.GET_OK(data, total);
    }
    async getUserById(userId) {
        return tools_1.ResponseTool.GET_OK(await this.userService.findById(userId));
    }
    async getUserByIdAdmin(userId) {
        return tools_1.ResponseTool.GET_OK(await this.userService.findByIdAdmin(userId));
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    (0, swagger_1.ApiCreatedResponse)({
        type: dto_1.UserDTO,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('/follow/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiCreatedResponse)({ type: common_2.ResponseDTO }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followUser", null);
__decorate([
    (0, common_1.Post)('/un-follow/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiCreatedResponse)({ type: common_2.ResponseDTO }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unFollowUser", null);
__decorate([
    (0, common_1.Post)('/follow/anonymous'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FollowAnonymousDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followAnonymous", null);
__decorate([
    (0, common_1.Patch)('/update'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Patch)('/update/ban-status/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateBanStatusOfUser", null);
__decorate([
    (0, common_1.Patch)('/update/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UserDTO, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserById", null);
__decorate([
    (0, common_1.Patch)('/report/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "reportTweet", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_2.ApiQueryGetMany)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({
        type: common_2.ResponseDTO,
    }),
    __param(0, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)('/popular'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    (0, swagger_1.ApiOkResponse)({ type: common_2.ResponseDTO }),
    (0, common_2.ApiQueryGetMany)(),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_2.QueryGet)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPopularUsers", null);
__decorate([
    (0, common_1.Get)('/:userId'),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.UserDTO }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('/admin/:userId'),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.UserDTO }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByIdAdmin", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('Users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=users.controller.js.map