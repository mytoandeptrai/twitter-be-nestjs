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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const common_2 = require("../../common");
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
const constants_2 = require("./constants");
const entities_1 = require("./entities");
const repository_1 = require("./repository");
const tweet_service_1 = require("../tweet/tweet.service");
let UsersService = class UsersService {
    constructor(userModel, userRepository, tweetService) {
        this.userModel = userModel;
        this.userRepository = userRepository;
        this.tweetService = tweetService;
    }
    deleteUnnecessaryFieldsForUpdating(user) {
        delete user.oldPassword;
        delete user.newPassword;
        delete user.newPasswordConfirm;
    }
    count({ conditions } = {}) {
        return Object.keys(conditions || {}).length > 0
            ? this.userModel.countDocuments(conditions).exec()
            : this.userModel.estimatedDocumentCount().exec();
    }
    async validateUsernameOrEmail(username) {
        if (!username)
            return false;
        return constants_2.REGEX_USER.test(username) || constants_2.REGEX_EMAIL.test(username);
    }
    async generateNewPassword(password) {
        return bcrypt.hash(password, 10);
    }
    async findAll(option, conditions = {}) {
        return this.userRepository.findAll(option, conditions);
    }
    async findAllAndCount(option, conditions = {}) {
        const response = this.findAll(option, conditions);
        const count = this.count({ conditions });
        const [data, total] = await Promise.all([response, count]);
        return { data, total };
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if ((user === null || user === void 0 ? void 0 : user.status.toString()) !== 'active') {
            return (0, utils_1.ResponseMessage)(`${user === null || user === void 0 ? void 0 : user.name} was banned`, 'BAD_REQUEST');
        }
        return user;
    }
    async findByIdAdmin(id) {
        return this.userRepository.findById(id);
    }
    async findByUsernameOrEmail(usernameOrEmail) {
        return this.userRepository.findByUsernameOrEmail(usernameOrEmail);
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findByGoogleId(id) {
        return this.userModel
            .findOne({
            'google.id': id,
        })
            .exec();
    }
    async search(search, query) {
        const conditions = {
            role: { $eq: 'user' },
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    username: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    id: search,
                },
                {
                    status: {
                        $regex: search,
                    },
                },
            ],
        };
        return this.findAllAndCount(query.options, conditions);
    }
    async getUserList(query) {
        const conditions = {
            role: { $eq: 'user' },
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        };
        return this.findAllAndCount(query.options, conditions);
    }
    async getPopularUsers(user, option) {
        const data = await this.userModel
            .aggregate([
            {
                $addFields: {
                    followers_count: {
                        $size: { $ifNull: ['$followers', []] },
                    },
                },
            },
            {
                $sort: { followers_count: -1 },
            },
            ...(((user === null || user === void 0 ? void 0 : user._id) && [
                {
                    $match: {
                        _id: { $ne: user._id },
                        followers: { $ne: user._id },
                        role: { $eq: 'user' },
                    },
                },
            ]) ||
                []),
        ])
            .skip(option.skip)
            .limit(option.limit)
            .exec();
        await this.userModel.populate(data, {
            path: 'followers',
            select: '_id',
        });
        const conditions = Object.assign({}, ((user === null || user === void 0 ? void 0 : user._id) && {
            _id: { $ne: user._id },
            followers: { $ne: user._id },
        }));
        const count = await this.userModel.countDocuments(conditions);
        return {
            data,
            total: count,
        };
    }
    async createUser(user) {
        const validateUsernameOrEmail = await this.validateUsernameOrEmail(user.username);
        if (!validateUsernameOrEmail) {
            return (0, utils_1.ResponseMessage)(`${constants_1.MSG.FRONTEND.INVALID_USERNAME}`, 'BAD_REQUEST');
        }
        const createdUser = new this.userModel(user);
        const existedUserEmail = await this.checkIfEmailAlreadyTakenByOtherUser(createdUser.email, createdUser.id.toString());
        if (existedUserEmail) {
            return (0, utils_1.ResponseMessage)('Email is already taken', 'BAD_REQUEST');
        }
        if (!createdUser.checkPasswordConfirm()) {
            return (0, utils_1.ResponseMessage)('Password and confirm password are not equal', 'BAD_REQUEST');
        }
        try {
            await createdUser.save();
            return createdUser;
        }
        catch (error) {
            return (0, utils_1.ResponseMessage)(`${error}`, 'SERVICE_UNAVAILABLE');
        }
    }
    async preUpdateUser(userId, newUserInfo) {
        const user = await this.findById(userId);
        if (!user) {
            return (0, utils_1.ResponseMessage)('User does not exist', 'BAD_REQUEST');
        }
        const userEmail = newUserInfo === null || newUserInfo === void 0 ? void 0 : newUserInfo.email;
        let userPassword = newUserInfo === null || newUserInfo === void 0 ? void 0 : newUserInfo.password;
        const userNewPassword = newUserInfo === null || newUserInfo === void 0 ? void 0 : newUserInfo.newPassword;
        if (userEmail) {
            await this.checkIfEmailIsAvailable(userEmail, userId);
        }
        if (userPassword) {
            userPassword = await this.generateNewPassword(userPassword);
        }
        if (newUserInfo.oldPassword) {
            const isPasswordCorrect = await this.checkIfPasswordIsCorrect(user, newUserInfo.oldPassword);
            if (!isPasswordCorrect) {
                return (0, utils_1.ResponseMessage)('Old password is not valid', 'BAD_REQUEST');
            }
            newUserInfo.password = await this.generateNewPassword(userNewPassword);
            this.deleteUnnecessaryFieldsForUpdating(newUserInfo);
        }
        return newUserInfo;
    }
    async updateUser(userId, data) {
        try {
            const newUserInfo = await this.preUpdateUser(userId, data);
            const responseData = await this.userModel.findOneAndUpdate({
                _id: userId,
            }, newUserInfo, {
                new: true,
            });
            return responseData;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async updateUserById(userId, data, requestUser) {
        if (!this.isAdminRole(requestUser)) {
            return (0, utils_1.ResponseMessage)('You are not an admin', 'METHOD_NOT_ALLOWED');
        }
        return this.updateUser(userId, data);
    }
    async followUser(user, userToFollowId) {
        try {
            const userId = user._id.toString();
            if (userId === userToFollowId) {
                return (0, utils_1.ResponseMessage)('User can not follow yourself', 'BAD_REQUEST');
            }
            const hasFollowed = user.following.findIndex((user) => user._id.toString() === userToFollowId);
            if (hasFollowed > -1) {
                return (0, utils_1.ResponseMessage)('You followed this user', 'BAD_REQUEST');
            }
            const userToFollow = await this.findById(userToFollowId);
            if (!userToFollow) {
                return (0, utils_1.ResponseMessage)('This user does not exist', 'BAD_REQUEST');
            }
            await this.userModel.findOneAndUpdate({ _id: userToFollowId }, {
                $push: { followers: userId },
            });
            await this.userModel.findOneAndUpdate({ _id: userId }, {
                $push: { following: userToFollowId },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async unFollowUser(user, userToUnFollowId) {
        try {
            const userId = user._id.toString();
            if (userId === userToUnFollowId) {
                return (0, utils_1.ResponseMessage)('User can not unFollow yourself', 'BAD_REQUEST');
            }
            const hasFollowed = user.following.findIndex((user) => user._id.toString() === userToUnFollowId);
            if (hasFollowed === -1) {
                return (0, utils_1.ResponseMessage)('You have not followed this user before', 'BAD_REQUEST');
            }
            const userToUnFollow = await this.findById(userToUnFollowId);
            if (!userToUnFollow) {
                return (0, utils_1.ResponseMessage)('This user does not exist', 'BAD_REQUEST');
            }
            await this.userModel.findOneAndUpdate({ _id: userId }, {
                $pull: { following: userToUnFollowId },
            });
            await this.userModel.findOneAndUpdate({ _id: userToUnFollowId }, {
                $pull: { followers: userId },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async reportUser(userId) {
        const user = await this.findById(userId);
        if (user) {
            user.reportedCount = +(user.reportedCount || 0) + 1;
            return this.userModel.findByIdAndUpdate(userId, {
                reportedCount: user.reportedCount,
            });
        }
        else {
            return (0, utils_1.ResponseMessage)('This user does not exist', 'BAD_REQUEST');
        }
    }
    async followAnonymous({ userAId, userBId }) {
        const userA = await this.findById(userAId);
        if (!userA.following.some((user) => user._id.toString() === userBId)) {
            const userB = await this.findById(userBId);
            userA.following.push(userB);
            userB.followers.push(userA);
            await this.userModel.findByIdAndUpdate(userA._id, {
                following: userA.following,
            });
            await this.userModel.findByIdAndUpdate(userB._id, {
                followers: userB.followers,
            });
        }
    }
    async updateBanStatusOfUser(requestUser, banStatus, userId) {
        if (!this.isAdminRole(requestUser)) {
            return (0, utils_1.ResponseMessage)('You are not an admin', 'METHOD_NOT_ALLOWED');
        }
        const updatedUser = await this.userModel.findOneAndUpdate({ _id: userId }, {
            status: banStatus,
        }, { new: true });
        return updatedUser;
    }
    isAdminRole(requestUser) {
        return constants_1.ROOT_ROLES.includes(requestUser.role);
    }
    async checkIfPasswordIsCorrect(user, password) {
        return bcrypt.compare(password, user.password.toString());
    }
    async checkIfEmailAlreadyTakenByOtherUser(email, userId) {
        const user = await this.userModel.findOne({
            email,
        });
        if (!user) {
            return false;
        }
        return user && (user === null || user === void 0 ? void 0 : user._id) && user._id.toString() != userId;
    }
    async checkIfEmailIsAvailable(email, userId) {
        const validateUsernameOrEmail = await this.validateUsernameOrEmail(email);
        if (!validateUsernameOrEmail) {
            return (0, utils_1.ResponseMessage)('Invalid Email', 'BAD_REQUEST');
        }
        const isEmailAlreadyTakenByOtherUser = await this.checkIfEmailAlreadyTakenByOtherUser(email, userId);
        if (isEmailAlreadyTakenByOtherUser) {
            return (0, utils_1.ResponseMessage)('Email is already taken', 'BAD_REQUEST');
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entities_1.User.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => tweet_service_1.TweetService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        repository_1.UserRepository,
        tweet_service_1.TweetService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map