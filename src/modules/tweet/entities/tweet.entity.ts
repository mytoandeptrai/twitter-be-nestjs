import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { User, UserDocument } from 'modules/users/entities';
import { Document, Schema as MongoSchema } from 'mongoose';
import { EAudienceConstant } from '../../../constants';
import { TWEET_MODEL } from '../constants';

@Schema({
  timestamps: true,
  collection: TWEET_MODEL,
  toJSON: { virtuals: true },
})
export class Tweet {
  @IsString()
  @Prop({
    type: String,
  })
  content: string;

  @Prop([String])
  tags: string[];

  @IsString()
  @Prop([String])
  media: string[];

  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: User.name,
  })
  author: UserDocument;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: User.name }] })
  likes: UserDocument[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: User.name }] })
  saved: UserDocument[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: User.name }] })
  retweeted: UserDocument[];

  @Prop({ type: MongoSchema.Types.ObjectId, ref: User.name })
  retweetedBy: UserDocument;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  modifiedAt: Date;

  @Prop({
    type: Number,
    enum: Object.values(EAudienceConstant),
  })
  audience: number;

  @Prop(Boolean)
  isRetweet: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  reportedCount: number;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);

export interface TweetDocument extends Tweet, Document {}
