import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserDocument } from 'modules/users/entities';
import { Document, Schema as MongoSchema } from 'mongoose';
import { MESSAGE_MODEL } from '../constants';

@Schema({
  collection: MESSAGE_MODEL,
  toJSON: { virtuals: true },
})
export class Message {
  @Prop(String)
  content: string;

  @Prop(String)
  file?: string;

  @Prop(Date)
  createdAt: Date;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: User.name })
  author: UserDocument;

  @Prop(String)
  roomId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export interface MessageDocument extends Message, Document {}
