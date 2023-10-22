import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { ROOM_MODEL } from '../constants';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'modules/users/entities';

@Schema({
  collection: ROOM_MODEL,
  toJSON: {
    virtuals: true,
  },
})
export class Room {
  _id: string;

  @IsString()
  @Prop(String)
  name: string;

  @IsString()
  @Prop(String)
  description: string;

  @IsString()
  @Prop(String)
  image: string;

  @IsDate()
  @Prop(Date)
  createdAt: Date;

  @IsDate()
  @Prop(Date)
  updatedAt: Date;

  @IsBoolean()
  @Prop(Boolean)
  isDm: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: UserDocument;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  members: UserDocument[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

export interface RoomDocument extends Room, Document {}
