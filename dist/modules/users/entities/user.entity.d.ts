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
import { Schema as MongoSchema } from 'mongoose';
export declare class User {
    name: string;
    bio: string;
    avatar: string;
    coverPhoto: string;
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
    gender: number;
    birthday: Date;
    facebook: {
        id: string;
    };
    google: {
        id: string;
    };
    github: {
        id: string;
    };
    isThirdParty: boolean;
    jti: string;
    followers: UserDocument[];
    following: UserDocument[];
    storyAudience: number;
    status: string;
    role: string;
    reportedCount: number;
    callingId: string;
    socketId: string;
    comparePassword: (password: string) => Promise<boolean>;
    checkPasswordConfirm: () => boolean;
}
export declare const UserSchema: MongoSchema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}>;
export interface UserDocument extends User, Document {
    [x: string]: any;
}
