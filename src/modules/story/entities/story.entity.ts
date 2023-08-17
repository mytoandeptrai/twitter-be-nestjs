import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { User, UserDocument } from 'modules/users/entities';
import * as mongoose from 'mongoose';
import { EAudienceConstant } from '../../../constants';
import { STORY_MODEL } from '../constants';

@Schema({
  collection: STORY_MODEL,
  toJSON: {
    virtuals: true,
  },
})
export class Story {
  _id: string;

  @IsString()
  @Prop(String)
  content: string;

  @IsString()
  @Prop(String)
  type: string;

  @IsNumber()
  @Prop({
    type: Number,
    enum: Object.values(EAudienceConstant),
    default: EAudienceConstant.PUBLIC,
  })
  audience: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: UserDocument;

  @Prop()
  viewerIds: string[];

  @Prop(Date)
  createdAt: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);

export interface StoryDocument extends Story, Document {}
