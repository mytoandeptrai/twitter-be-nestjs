import { Injectable } from '@nestjs/common';
import { CommentService } from 'modules/comment/comment.service';
import { HashtagService } from 'modules/hashtag/hashtag.service';
import { TweetService } from 'modules/tweet/tweet.service';
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { QueryPostOption } from 'tools';
import { SEARCH_KEYS } from './constants';

@Injectable()
export class SearchService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tweetService: TweetService,
    private readonly tagService: HashtagService,
    private readonly commentService: CommentService,
  ) {}

  async search(
    user: UserDocument,
    searchQuery: { search: string; category: string },
    query: QueryPostOption,
  ) {
    switch (searchQuery.category) {
      case SEARCH_KEYS.TWEET:
        return this.tweetService.search(user, searchQuery.search, query);
      case SEARCH_KEYS.PEOPLE:
        return this.usersService.search(searchQuery.search, query);
      case SEARCH_KEYS.HASHTAG:
        return this.tagService.search(searchQuery.search, query);
      case SEARCH_KEYS.COMMENT:
        return this.commentService.search(searchQuery.search, query);
      default:
        return {
          data: [],
          total: 0,
        };
    }
  }
}
