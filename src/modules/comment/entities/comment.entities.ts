import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsString } from 'class-validator';
import { Tweet, TweetDocument } from 'modules/tweet/entities';
import { User, UserDocument } from 'modules/users/entities';
import { Document, Schema as MongoSchema } from 'mongoose';
import { COMMENT_MODEL } from '../constants';

@Schema({
  collection: 'comments',
})
export class Comment {
  @IsString()
  @Prop(String)
  content: string;

  @IsDate()
  @Prop(Date)
  createdAt: Date;

  @IsDate()
  @Prop(Date)
  modifiedAt: Date;

  @IsString()
  @Prop(String)
  media: string;

  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: Tweet.name,
  })
  tweet: TweetDocument;

  // author prop refs to a User
  @Prop({
    type: MongoSchema.Types.ObjectId,
    ref: User.name,
  })
  author: UserDocument;

  @Prop()
  likes: string[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: Comment.name }] })
  replies: Comment[];

  @Prop(Boolean)
  isChild: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export interface CommentDocument extends Comment, Document {}
