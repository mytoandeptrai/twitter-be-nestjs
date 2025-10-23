import { UserDocument } from 'modules/users/entities';
import * as mongoose from 'mongoose';
export declare class Story {
    _id: string;
    content: string;
    type: string;
    audience: number;
    owner: UserDocument;
    viewerIds: string[];
    createdAt: Date;
}
export declare const StorySchema: mongoose.Schema<Story, mongoose.Model<Story, any, any, any, mongoose.Document<unknown, any, Story> & Story & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Story, mongoose.Document<unknown, {}, Story> & Story & Required<{
    _id: string;
}>>;
export interface StoryDocument extends Story, Document {
}
