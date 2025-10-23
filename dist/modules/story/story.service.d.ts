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
import { Model } from 'mongoose';
import { QueryOption } from 'tools';
import { StoryDocument } from './entities';
import { StoryDTO } from './dto';
export declare class StoryService {
    private storyModel;
    constructor(storyModel: Model<StoryDocument>);
    findAll(option: QueryOption, conditions?: any): Promise<StoryDocument[]>;
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    findStory(id: string): Promise<StoryDocument | null>;
    getStories(user: UserDocument, query: QueryOption): Promise<StoryDocument[]>;
    getMeStories(user: UserDocument, query: QueryOption): Promise<StoryDocument[]>;
    createStory(createStoryDto: StoryDTO, user: UserDocument): Promise<StoryDocument>;
    updateStory(id: string, user: UserDocument): Promise<(import("mongoose").Document<unknown, {}, StoryDocument> & StoryDocument & Required<{
        _id: string;
    }>) | undefined>;
    deleteStory(id: string, user: UserDocument): Promise<(import("mongoose").Document<unknown, {}, StoryDocument> & StoryDocument & Required<{
        _id: string;
    }>) | null>;
}
