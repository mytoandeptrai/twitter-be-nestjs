import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HASH_TAGS_MODEL } from '../constants';

@Schema({
  collection: HASH_TAGS_MODEL,
})
export class Hashtag {
  @Prop(String)
  name: string;

  @Prop(Number)
  count: number;
}

export const HashtagSchema = SchemaFactory.createForClass(Hashtag);

export interface HashtagDocument extends Hashtag, Document {}
