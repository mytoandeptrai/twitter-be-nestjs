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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const common_1 = require("@nestjs/common");
const dto_2 = require("../users/dto");
const common_2 = require("../../common");
const entities_1 = require("../users/entities");
const decorators_1 = require("../users/decorators");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(userDto) {
        return this.authService.signUp(userDto);
    }
    async signIn(loginDTO) {
        return this.authService.signIn(loginDTO);
    }
    async logout(user) {
        return await this.authService.logout(user);
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    (0, swagger_1.ApiOkResponse)({
        type: dto_1.AccessTokenResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_2.UserDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('/signin'),
    (0, swagger_1.ApiOkResponse)({
        type: dto_1.AccessTokenResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.UseGuards)(common_2.MyTokenAuthGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Apis Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map