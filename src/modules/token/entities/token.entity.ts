import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TOKEN_MODEL } from '../constants';

@Schema({
  collection: TOKEN_MODEL,
  toJSON: { virtuals: true },
})
export class Token {
  @Prop(String)
  key: string;

  @Prop(Number)
  expAt: number;

  @Prop(Number)
  createdAt: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

export interface TokenDocument extends Token, Document {}
