import { CommentService } from 'modules/comment/comment.service';
import { HashtagService } from 'modules/hashtag/hashtag.service';
import { TweetService } from 'modules/tweet/tweet.service';
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { QueryPostOption } from 'tools';
export declare class SearchService {
    private readonly usersService;
    private readonly tweetService;
    private readonly tagService;
    private readonly commentService;
    constructor(usersService: UsersService, tweetService: TweetService, tagService: HashtagService, commentService: CommentService);
    search(user: UserDocument, searchQuery: {
        search: string;
        category: string;
    }, query: QueryPostOption): Promise<import("../../common").ResponseDTO>;
}
