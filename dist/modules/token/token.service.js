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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const entities_1 = require("./entities");
const constants_1 = require("./constants");
let TokenService = class TokenService {
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }
    JWTKey(userID, jti) {
        return `JWT[${userID}][${jti}]`;
    }
    async setJWTKey(userID, jti, duration, timestamp) {
        const key = this.JWTKey(userID, jti);
        const expAt = timestamp + duration;
        const newToken = new this.tokenModel({
            key,
            expAt,
            createdAt: timestamp,
        });
        try {
            await newToken.save();
        }
        catch (error) {
            throw error;
        }
    }
    async checkJWTKey(userID, jti) {
        const tokenDb = await this.tokenModel.findOne({
            key: this.JWTKey(userID, jti),
        });
        return tokenDb != null;
    }
    async deleteJWTKey(userID, jti) {
        try {
            const response = await this.tokenModel.deleteOne({
                key: this.JWTKey(userID, jti),
            });
            return response.deletedCount;
        }
        catch (error) {
            return 0;
        }
    }
    async deleteJWTKeysCreatedBeforeDate(threshold) {
        try {
            const response = await this.tokenModel.deleteMany({
                createdAt: { $lt: threshold },
            });
            return response.deletedCount;
        }
        catch (error) {
            console.log(`error`, error);
        }
    }
    async deleteExpiredJWTKeys() {
        try {
            const response = await this.tokenModel.deleteMany({
                expAt: { $lt: Date.now() },
            });
            return response.deletedCount;
        }
        catch (error) {
            console.log(`error`, error);
        }
    }
    async deleteJWTKeysByUserID(userID) {
        try {
            const response = await this.tokenModel.deleteMany({
                key: { $regex: constants_1.REGEX_TOKEN.replace(`{userID}`, userID) },
            });
            return response.deletedCount;
        }
        catch (error) {
            console.log(`error`, error);
        }
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_1.Token.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map