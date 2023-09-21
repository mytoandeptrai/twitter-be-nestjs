import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import { TweetService } from 'modules/tweet/tweet.service';
import { UserDocument } from 'modules/users/entities';
import mongoose, { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { ResponseMessage } from 'utils';
import { CreateCommentDTO } from './dto';
import { Comment, CommentDocument } from './entities';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => TweetService))
    private readonly tweetService: TweetService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  /** COMMONS */

  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.commentModel.countDocuments(conditions).exec()
      : this.commentModel.estimatedDocumentCount().exec();
  }

  async findAll(option: QueryOption, conditions: any = {}): Promise<Comment[]> {
    return this.commentModel
      .find(conditions)
      .sort(option.sort)
      .skip(option.skip as number)
      .limit(option.limit as number)
      .populate('author', 'name avatar coverPhoto')
      .populate('tweet', '_id')
      .sort({
        createdAt: -1,
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: '_id name avatar coverPhoto',
        },
      });
  }

  async findAllAndCount(
    option: QueryOption,
    conditions: any = {},
  ): Promise<ResponseDTO> {
    const data = await this.findAll(option, conditions);
    const total = await this.count({ conditions });
    return { data, total };
  }

  /** QUERIES */

  async getCommentById(
    commentId: string,
  ): Promise<CommentDocument | null | undefined> {
    try {
      const comment = await this.commentModel.findById(commentId);
      return comment;
    } catch (error) {
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }

  async findCommentsByTweetId(
    tweetId: string,
    user: UserDocument,
    query: QueryPostOption,
  ): Promise<ResponseDTO> {
    try {
      const tweet = await this.tweetService.getTweet(tweetId, user);
      if (!tweet) {
        return ResponseMessage('Tweet not found', 'BAD_REQUEST');
      }
      const conditions = {
        tweet: tweetId,
        isChild: false,
      };
      return this.findAllAndCount(query.options as QueryOption, conditions);
    } catch (error) {
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }

  async findCommentsByUser(
    user: UserDocument,
    query: QueryPostOption,
  ): Promise<ResponseDTO> {
    try {
      const conditions = {
        author: user._id,
      };
      return this.findAllAndCount(query.options as QueryOption, conditions);
    } catch (error) {
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }

  async search(search: string, query: QueryPostOption) {
    const conditions = {
      content: { $regex: search, $options: 'i' },
    };
    return this.findAllAndCount(query.options as QueryOption, conditions);
  }

  /** MUTATIONS */

  async createComment(
    createCommentDto: CreateCommentDTO,
    user: UserDocument,
    tweetId: string,
  ): Promise<CommentDocument | undefined> {
    /** step 1: Find tweet by Id */
    let tweet = await this.tweetService.getTweet(tweetId, user);
    let parentComment: CommentDocument | null | undefined;

    /** step 2: Check if tweet is not found -> this is a reply to a comment */
    if (!tweet) {
      parentComment = await this.getCommentById(tweetId);
      if (!parentComment) {
        return ResponseMessage('Comment not found', 'BAD_REQUEST');
      }

      tweet = parentComment.tweet;
    }

    const newComment = new this.commentModel({
      ...createCommentDto,
      isEdited: false,
      tweet: tweet,
      author: user,
      modifiedAt: new Date(),
      createdAt: new Date(),
      isChild: !!parentComment,
      likes: [],
    });

    /** step 3: Create transaction to save newComment and parentComment */
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const comment = await newComment.save();
      if (parentComment) {
        parentComment.replies.push(comment);
        await parentComment.save();
      }
      await session.commitTransaction();
      session.endSession();
      return comment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }

  async updateComment(
    commentId: string,
    updateCommentDto: CreateCommentDTO,
    user: UserDocument,
  ): Promise<CommentDocument | null> {
    const updatedComment: any = { ...updateCommentDto };
    const comment = await this.getCommentById(commentId);

    if (!comment) {
      return ResponseMessage('Comment not found', 'BAD_REQUEST');
    }

    if (comment.author.username !== user.username) {
      return ResponseMessage(
        'You are not allowed to update this comment',
        'BAD_REQUEST',
      );
    }

    updatedComment.modifiedAt = new Date();
    updatedComment.isEdited = true;

    try {
      const comment = await this.commentModel.findByIdAndUpdate(
        commentId,
        updateCommentDto,
        { new: true },
      );
      return comment;
    } catch (error) {
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }

  async deleteComment(commentId: string, user: UserDocument): Promise<void> {
    const comment = await this.getCommentById(commentId);

    if (!comment) {
      return ResponseMessage('Comment not found', 'BAD_REQUEST');
    }

    if (comment.author.username !== user.username) {
      return ResponseMessage(
        'You are not allowed to update this comment',
        'BAD_REQUEST',
      );
    }

    try {
      if (!!comment.replies.length) {
        await this.commentModel
          .deleteMany({
            _id: { $in: comment.replies },
          })
          .lean();
      }

      await this.commentModel.findByIdAndDelete(commentId).lean();
    } catch (error) {
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }

  async deleteCommentByTweetId(tweetId: string): Promise<void> {
    const tweet = await this.tweetService.getTweetById(tweetId);
    await this.commentModel.deleteMany({ tweet });
  }

  async reactComment(
    user: UserDocument,
    commentId: string,
  ): Promise<CommentDocument> {
    try {
      const comment = await this.getCommentById(commentId);
      if (!comment) {
        return ResponseMessage('Comment not found', 'BAD_REQUEST');
      }

      const userIdStr = user._id.toString();

      const userLikedIndex = comment.likes.findIndex(
        (userId) => userId.toString() === userIdStr,
      );

      if (userLikedIndex !== -1) {
        comment.likes.splice(userLikedIndex, 1);
      } else {
        comment.likes.push(user._id);
      }

      const response = await comment.save();
      return response;
    } catch (error) {
      return ResponseMessage(`${error?.message}`, 'BAD_REQUEST');
    }
  }
}
