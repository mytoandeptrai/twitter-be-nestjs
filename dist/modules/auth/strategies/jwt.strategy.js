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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const token_service_1 = require("../../token/token.service");
const entities_1 = require("../../users/entities");
const users_service_1 = require("../../users/users.service");
const passport_jwt_1 = require("passport-jwt");
const constants_1 = require("./../../../constants");
const utils_1 = require("../../../utils");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userService, tokenService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.JWT_SECRET,
        });
        this.userService = userService;
        this.tokenService = tokenService;
    }
    async validate(payload) {
        const { sub, jti } = payload;
        const user = await this.userService.findById(sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        user.jti = payload.jti;
        const checkJwt = await this.tokenService.checkJWTKey(sub, jti);
        if (!checkJwt) {
            return (0, utils_1.ResponseMessage)(`${constants_1.MSG.FRONTEND.UN_AUTHORIZED}`, 'UNAUTHORIZED');
        }
        return user;
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        token_service_1.TokenService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map