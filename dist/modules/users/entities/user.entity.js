"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../constants");
const constants_2 = require("../constants");
let User = User_1 = class User {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        trim: true,
        maxlength: constants_2.USER_CONST.NAME_MAX_LENGTH,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "coverPhoto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(constants_2.USER_CONST.USERNAME_MIN_LENGTH, constants_2.USER_CONST.USERNAME_MAX_LENGTH),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(constants_2.USER_CONST.PASSWORD_MIN_LENGTH, constants_2.USER_CONST.PASSWORD_MAX_LENGTH),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(constants_2.USER_CONST.PASSWORD_MIN_LENGTH, constants_2.USER_CONST.PASSWORD_MAX_LENGTH),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "passwordConfirm", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, mongoose_1.Prop)({
        type: Number,
        enum: Object.values(constants_1.EGenderConstant),
        default: constants_1.EGenderConstant.UNKNOWN,
    }),
    __metadata("design:type", Number)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], User.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        id: {
            type: String,
        },
    })),
    __metadata("design:type", Object)
], User.prototype, "facebook", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        id: {
            type: String,
        },
    })),
    __metadata("design:type", Object)
], User.prototype, "google", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        id: {
            type: String,
        },
    })),
    __metadata("design:type", Object)
], User.prototype, "github", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], User.prototype, "isThirdParty", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "jti", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: User_1.name }],
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "followers", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: User_1.name }],
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "following", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, mongoose_1.Prop)({
        type: Number,
        enum: Object.values(constants_1.EAudienceConstant),
        default: constants_1.EAudienceConstant.PUBLIC,
    }),
    __metadata("design:type", Number)
], User.prototype, "storyAudience", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'active',
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        required: true,
        trim: true,
        default: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "reportedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "callingId", void 0);
User = User_1 = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: constants_2.USER_MODEL,
        toJSON: { virtuals: true },
    })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.pre('save', async function () {
    const password = this.get('password');
    if (password) {
        const newPassword = password
            ? await bcrypt.hash(password, constants_2.BCRYPT_HASH_NUMBER)
            : null;
        this.set('passwordConfirm', null);
        this.set('password', newPassword);
    }
});
exports.UserSchema.methods.comparePassword = async function comparePassword(password) {
    return bcrypt.compare(password, this.password.toString());
};
exports.UserSchema.methods.checkPasswordConfirm = function () {
    return this.get('password') === this.get('passwordConfirm');
};
//# sourceMappingURL=user.entity.js.map