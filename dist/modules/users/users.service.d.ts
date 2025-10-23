/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ResponseDTO } from 'common';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { FollowAnonymousDto, UpdateUserDTO } from './dto';
import { User, UserDocument } from './entities';
import { UserRepository } from './repository';
import { TweetService } from 'modules/tweet/tweet.service';
export declare class UsersService {
    private readonly userModel;
    private readonly userRepository;
    private readonly tweetService;
    constructor(userModel: Model<UserDocument>, userRepository: UserRepository, tweetService: TweetService);
    deleteUnnecessaryFieldsForUpdating(user: UpdateUserDTO): void;
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    validateUsernameOrEmail(username?: string): Promise<boolean>;
    generateNewPassword(password: string): Promise<string>;
    findAll(option: QueryOption, conditions?: any): Promise<UserDocument[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    findById(id: string): Promise<UserDocument>;
    findByIdAdmin(id: string): Promise<UserDocument | null>;
    findByUsernameOrEmail(usernameOrEmail: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findByGoogleId(id: string): Promise<UserDocument | null>;
    search(search: string, query: QueryPostOption): Promise<ResponseDTO>;
    getUserList(query: QueryPostOption): Promise<ResponseDTO>;
    getPopularUsers(user: UserDocument, option: QueryOption): Promise<{
        data: UserDocument[];
        total: number;
    }>;
    createUser(user: Partial<User>): Promise<UserDocument>;
    preUpdateUser(userId: string, newUserInfo: UpdateUserDTO): Promise<UpdateUserDTO>;
    updateUser(userId: string, data: UpdateUserDTO): Promise<UserDocument>;
    updateUserById(userId: string, data: UpdateUserDTO, requestUser: UserDocument): Promise<UserDocument>;
    followUser(user: UserDocument, userToFollowId: string): Promise<undefined>;
    unFollowUser(user: UserDocument, userToUnFollowId: string): Promise<undefined>;
    reportUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument> & UserDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    followAnonymous({ userAId, userBId }: FollowAnonymousDto): Promise<void>;
    updateBanStatusOfUser(requestUser: UserDocument, banStatus: string, userId: string): Promise<UserDocument>;
    isAdminRole(requestUser: UserDocument): boolean;
    checkIfPasswordIsCorrect(user: UserDocument, password: string): Promise<boolean>;
    checkIfEmailAlreadyTakenByOtherUser(email: string, userId: string): Promise<boolean>;
    checkIfEmailIsAvailable(email: string, userId: string): Promise<void>;
}
