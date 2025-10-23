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
import { UserDocument } from 'modules/users/entities';
import { Document, Schema as MongoSchema } from 'mongoose';
export declare class Tweet {
    content: string;
    tags: string[];
    media: string[];
    author: UserDocument;
    likes: UserDocument[];
    saved: UserDocument[];
    retweeted: UserDocument[];
    retweetedBy: UserDocument;
    createdAt: Date;
    modifiedAt: Date;
    audience: number;
    isRetweet: boolean;
    reportedCount: number;
}
export declare const TweetSchema: MongoSchema<Tweet, import("mongoose").Model<Tweet, any, any, any, Document<unknown, any, Tweet> & Tweet & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tweet, Document<unknown, {}, Tweet> & Tweet & {
    _id: import("mongoose").Types.ObjectId;
}>;
export interface TweetDocument extends Tweet, Document {
}
