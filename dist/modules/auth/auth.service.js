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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const token_service_1 = require("../token/token.service");
const dto_1 = require("../users/dto");
const entities_1 = require("../users/entities");
const users_service_1 = require("../users/users.service");
const mongodb_1 = require("mongodb");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
let AuthService = class AuthService {
    constructor(userService, jwtService, tokenService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
    }
    async generateAccessToken(userId, timestamp = Date.now()) {
        const jti = new mongodb_1.ObjectId().toHexString();
        const payload = {
            sub: userId,
            jti,
        };
        await this.tokenService.setJWTKey(userId, jti, constants_1.JWT_EXP, timestamp);
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }
    async verifyAccessToken(accessToken) {
        const verifiedToken = await this.jwtService.verify(accessToken);
        if (!verifiedToken) {
            return false;
        }
        const { sub, jti } = verifiedToken;
        const checkJwt = await this.tokenService.checkJWTKey(sub, jti);
        return checkJwt;
    }
    async signUp(userDto, timestamp = Date.now()) {
        const userBody = Object.assign(Object.assign({}, userDto), { avatar: constants_1.AVATAR_URL, isThirdParty: false });
        const newUser = await this.userService.createUser(userBody);
        const accessToken = await this.generateAccessToken(newUser.id, timestamp);
        return {
            user: newUser,
            accessToken,
        };
    }
    async signIn(loginDto, timestamp = Date.now()) {
        var _a;
        const { username, password } = loginDto;
        const currentUser = await this.userService.findByUsernameOrEmail(username);
        if (!currentUser || ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.status) === null || _a === void 0 ? void 0 : _a.toString()) !== 'active') {
            return (0, utils_1.ResponseMessage)(`${constants_1.MSG.FRONTEND.USER_NOT_FOUND}`, 'BAD_REQUEST');
        }
        const isCorrectPassword = await currentUser.comparePassword(password);
        if (!isCorrectPassword) {
            return (0, utils_1.ResponseMessage)(`${constants_1.MSG.FRONTEND.WRONG_PASSWORD}`, 'UNAUTHORIZED');
        }
        const accessToken = await this.generateAccessToken(currentUser.id, timestamp);
        return {
            user: currentUser,
            accessToken,
        };
    }
    async logout(user) {
        try {
            await Promise.all([
                this.tokenService.deleteJWTKey(user.id, user.jti),
                this.tokenService.deleteExpiredJWTKeys(),
            ]);
            return {
                message: 'Good bye :)',
            };
        }
        catch (error) {
            return {
                message: 'Logout Error -_-',
            };
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        token_service_1.TokenService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map