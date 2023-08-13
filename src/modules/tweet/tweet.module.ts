import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'modules/users/users.module';
import { Tweet, TweetSchema } from './entities';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [TweetService],
  controllers: [TweetController],
  exports: [TweetService],
})
export class TweetModule {}
