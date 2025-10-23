import { ResponseDTO } from 'common';
import { TweetService } from 'modules/tweet/tweet.service';
import { UserDocument } from 'modules/users/entities';
import mongoose, { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { CreateCommentDTO } from './dto';
import { Comment, CommentDocument } from './entities';
export declare class CommentService {
    private readonly commentModel;
    private readonly tweetService;
    private readonly connection;
    constructor(commentModel: Model<CommentDocument>, tweetService: TweetService, connection: mongoose.Connection);
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    findAll(option: QueryOption, conditions?: any): Promise<Comment[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    getCommentById(commentId: string): Promise<CommentDocument | null | undefined>;
    findCommentsByTweetId(tweetId: string, user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    findCommentsByUser(user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    search(search: string, query: QueryPostOption): Promise<ResponseDTO>;
    createComment(createCommentDto: CreateCommentDTO, user: UserDocument, tweetId: string): Promise<CommentDocument | undefined>;
    updateComment(commentId: string, updateCommentDto: CreateCommentDTO, user: UserDocument): Promise<CommentDocument | null>;
    deleteComment(commentId: string, user: UserDocument): Promise<void>;
    deleteCommentByTweetId(tweetId: string): Promise<void>;
    reactComment(user: UserDocument, commentId: string): Promise<CommentDocument>;
}
