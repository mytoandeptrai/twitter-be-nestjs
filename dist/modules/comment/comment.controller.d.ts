import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { QueryPostOption } from 'tools';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getCommentsByUser(user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    getCommentsByTweet(user: UserDocument, tweetId: string, query: QueryPostOption): Promise<ResponseDTO>;
    reactComment(user: UserDocument, commentId: string): Promise<ResponseDTO>;
    postComment(tweetId: string, user: UserDocument, commentDto: CreateCommentDTO): Promise<ResponseDTO>;
    updateComment(commentId: string, user: UserDocument, commentDto: CreateCommentDTO): Promise<ResponseDTO>;
    deleteComment(commentId: string, user: UserDocument): Promise<ResponseDTO>;
}
