import { Module } from '@nestjs/common';
import { UsersModule } from 'modules/users/users.module';
import { HashtagModule } from '../hashtag/hashtag.module';
import { TweetModule } from '../tweet/tweet.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TweetModule, HashtagModule, UsersModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
