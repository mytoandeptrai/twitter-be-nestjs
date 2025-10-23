"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAdminTokenAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const constants_1 = require("../../constants");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../../utils");
let MyAdminTokenAuthGuard = class MyAdminTokenAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    handleRequest(err, user, info) {
        if (err)
            throw err;
        if (info instanceof jsonwebtoken_1.TokenExpiredError) {
            return (0, utils_1.ResponseMessage)('Token has expired', 'UNAUTHORIZED');
        }
        if (!constants_1.ROOT_ROLES.includes(user === null || user === void 0 ? void 0 : user.role)) {
            return (0, utils_1.ResponseMessage)('You are not an admin !', 'METHOD_NOT_ALLOWED');
        }
        return user;
    }
};
MyAdminTokenAuthGuard = __decorate([
    (0, common_1.Injectable)()
], MyAdminTokenAuthGuard);
exports.MyAdminTokenAuthGuard = MyAdminTokenAuthGuard;
//# sourceMappingURL=tokenAdmin.guard.js.map