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
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { CreateTweetDTO, UpdateTweetDto } from './dto';
import { TweetDocument } from './entities';
import { CommentService } from 'modules/comment/comment.service';
export declare class TweetService {
    private readonly tweetModel;
    private readonly usersService;
    private readonly commentService;
    constructor(tweetModel: Model<TweetDocument>, usersService: UsersService, commentService: CommentService);
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    isAdminRole(role: string): boolean;
    getInformationFromTweet(tweet: TweetDocument): {
        tweetAuthorId: any;
        isRetweet: boolean;
        retweetedById: any;
    };
    getMediaAggregation(): ({
        $addFields: {
            media_count: {
                $size: {
                    $ifNull: (string | never[])[];
                };
            };
            likes_count: {
                $size: {
                    $ifNull: (string | never[])[];
                };
            };
        };
        $sort?: undefined;
        $lookup?: undefined;
        $unwind?: undefined;
    } | {
        $sort: {
            likes_count: number;
        };
        $addFields?: undefined;
        $lookup?: undefined;
        $unwind?: undefined;
    } | {
        $lookup: {
            from: string;
            localField: string;
            foreignField: string;
            as: string;
        };
        $addFields?: undefined;
        $sort?: undefined;
        $unwind?: undefined;
    } | {
        $unwind: string;
        $addFields?: undefined;
        $sort?: undefined;
        $lookup?: undefined;
    })[];
    hasPermission(user: UserDocument, tweetId: string): Promise<TweetDocument | null | undefined>;
    findAll(option: QueryOption, conditions?: any): Promise<TweetDocument[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    createTweet(tweetDTO: CreateTweetDTO, user: UserDocument): Promise<TweetDocument>;
    updateTweet(tweetId: string, updatedData: UpdateTweetDto, user: UserDocument): Promise<TweetDocument | undefined>;
    deleteTweet(id: string, user: UserDocument): Promise<any>;
    deleteTweetWithoutPermission(tweetId: string): Promise<(import("mongoose").Document<unknown, {}, TweetDocument> & TweetDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null | undefined>;
    deleteTweetsOfUserWithoutPermission(userId: string): Promise<import("mongodb").DeleteResult | undefined>;
    reactTweet(id: string, user: UserDocument): Promise<any>;
    saveTweet(id: string, user: UserDocument): Promise<any>;
    reTweet(id: string, user: UserDocument): Promise<any>;
    createTweetByUserId(userId: string, createTweetData: CreateTweetDTO): Promise<TweetDocument | null>;
    reportTweet(tweetId: string): Promise<TweetDocument | undefined>;
    getTweet(id: string, user: UserDocument): Promise<TweetDocument | null | undefined>;
    getTweetById(id: string): Promise<TweetDocument | null>;
    getPublicOrFollowersOnlyTweets(user: UserDocument, option: QueryOption): Promise<ResponseDTO>;
    getTweetsByUser(userId: string, option: QueryOption, userRequest: UserDocument): Promise<ResponseDTO>;
    getLatestTweets(user: UserDocument, option: QueryOption): Promise<ResponseDTO>;
    getMostPopularTweets(user: UserDocument, option: QueryOption): Promise<ResponseDTO>;
    getSavedTweets(user: UserDocument, option: QueryOption): Promise<ResponseDTO>;
    getLikedTweets(userId: string, option: QueryOption): Promise<ResponseDTO>;
    getMostLikedTweets(): Promise<any[]>;
    getMostSavedTweets(): Promise<any[]>;
    getMostRetweetedTweets(): Promise<any[]>;
    getTweetStatistic(): Promise<{
        mostLikedTweets: any[] | never[];
        mostSavedTweets: any[] | never[];
        mostRetweetedTweets: any[] | never[];
    }>;
    search(user: UserDocument, search: string, query: QueryPostOption): Promise<ResponseDTO>;
    getTweetsByHashTag(user: UserDocument, hashTag: string, option: QueryOption): Promise<ResponseDTO>;
    getReportedTweets(): Promise<Omit<import("mongoose").Document<unknown, {}, TweetDocument> & TweetDocument & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
    getUserMedias(userParam: UserDocument, userId: string, option: QueryOption): Promise<ResponseDTO>;
    getMedias(user: UserDocument, option: QueryOption): Promise<ResponseDTO>;
    countTweetByHashTag(hashTag: string): Promise<number>;
    countTweetByUser(userId: string): Promise<number>;
}
