import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'modules/comment/comment.module';
import { UsersModule } from 'modules/users/users.module';
import { Tweet, TweetSchema } from './entities';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentModule),
  ],
  providers: [TweetService],
  controllers: [TweetController],
  exports: [TweetService],
})
export class TweetModule {}
