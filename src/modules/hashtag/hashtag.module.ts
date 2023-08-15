import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hashtag, HashtagSchema } from './entities';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hashtag.name,
        schema: HashtagSchema,
      },
    ]),
  ],
  providers: [HashtagService],
  exports: [HashtagService],
  controllers: [HashtagController],
})
export class HashtagModule {}
