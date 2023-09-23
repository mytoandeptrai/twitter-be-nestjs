import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { ResponseMessage } from 'utils';
import { EAudienceConstant, ROOT_ROLES } from '../../constants';
import { TWEET_LIMIT_DEFAULT, TWEET_SKIP_DEFAULT } from './constants';
import { CreateTweetDTO, EUpdateTweetType, UpdateTweetDto } from './dto';
import { Tweet, TweetDocument } from './entities';
import { ObjectId } from 'mongodb';
import { CommentService } from 'modules/comment/comment.service';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name)
    private readonly tweetModel: Model<TweetDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  /** COMMON */

  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.tweetModel.countDocuments(conditions).exec()
      : this.tweetModel.estimatedDocumentCount().exec();
  }

  isAdminRole(role: string): boolean {
    return ROOT_ROLES.includes(role);
  }

  getInformationFromTweet(tweet: TweetDocument) {
    const tweetAuthorId = tweet?.author?._id?.toString() || '';
    const isRetweet = tweet?.isRetweet || false;
    const retweetedById =
      (isRetweet && tweet?.retweetedBy?._id?.toString()) || '';

    return {
      tweetAuthorId,
      isRetweet,
      retweetedById,
    };
  }

  getMediaAggregation() {
    return [
      {
        $addFields: {
          media_count: { $size: { $ifNull: ['$media', []] } },
          likes_count: { $size: { $ifNull: ['$likes', []] } },
        },
      },
      {
        $sort: {
          likes_count: -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
    ];
  }

  async hasPermission(
    user: UserDocument,
    tweetId: string,
  ): Promise<TweetDocument | null | undefined> {
    const userId = user?._id?.toString();
    const currentTweet = await this.getTweet(tweetId, user);
    if (!currentTweet) {
      return ResponseMessage('Tweet is not found', 'BAD_REQUEST');
    }
    const { isRetweet, retweetedById, tweetAuthorId } =
      this.getInformationFromTweet(currentTweet);

    if (userId === tweetAuthorId || (isRetweet && userId === retweetedById)) {
      return currentTweet;
    }

    return null;
  }

  async findAll(
    option: QueryOption,
    conditions: any = {},
  ): Promise<TweetDocument[]> {
    return this.tweetModel
      .find(conditions)
      .sort(option.sort)
      .select({ password: 0, passwordConfirm: 0 })
      .skip(option.skip as number)
      .limit(option.limit as number)
      .populate('author', '_id name avatar coverPhoto followers gender')
      .populate('retweetedBy', 'name avatar coverPhoto')
      .populate('likes', 'name avatar bio')
      .populate('retweeted', 'name avatar bio')
      .populate('saved', 'name avatar bio');
  }

  async findAllAndCount(
    option: QueryOption,
    conditions: any = {},
  ): Promise<ResponseDTO> {
    const response = this.findAll(option, conditions);
    const count = this.count({ conditions });
    const [data, total] = await Promise.all([response, count]);

    return { data, total };
  }

  /** MUTATIONS */

  async createTweet(
    tweetDTO: CreateTweetDTO,
    user: UserDocument,
  ): Promise<TweetDocument> {
    const tweet = new this.tweetModel({
      ...tweetDTO,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isRetweet: false,
    });
    tweet.author = user;
    try {
      const response = await tweet.save();
      return response;
    } catch (error) {
      return ResponseMessage(error, 'SERVICE_UNAVAILABLE');
    }
  }

  async updateTweet(
    tweetId: string,
    updatedData: UpdateTweetDto,
    user: UserDocument,
  ): Promise<TweetDocument | undefined> {
    const isAuthor = await this.hasPermission(user, tweetId);
    if (!isAuthor) {
      return ResponseMessage(
        'You have no permission to update this tweet',
        'BAD_REQUEST',
      );
    }

    const updateType = updatedData.type;
    switch (updateType) {
      case EUpdateTweetType.REACT:
        return await this.reactTweet(tweetId, user);
      case EUpdateTweetType.SAVE:
        return await this.saveTweet(tweetId, user);
      case EUpdateTweetType.RETWEET:
        return await this.reTweet(tweetId, user);
      default:
        const response = await this.tweetModel
          .findByIdAndUpdate(tweetId, updatedData, { new: true })
          .exec();
        return response as TweetDocument;
    }
  }

  async deleteTweet(id: string, user: UserDocument): Promise<any> {
    const tweet = await this.hasPermission(user, id);
    if (!tweet) {
      return ResponseMessage(
        'You have no permission to update this tweet',
        'BAD_REQUEST',
      );
    }
    this.commentService.deleteCommentByTweetId(id);
    await this.tweetModel.findByIdAndRemove(id).exec();
  }

  async deleteTweetWithoutPermission(tweetId: string) {
    try {
      return this.tweetModel.findByIdAndDelete(tweetId);
    } catch (error) {
      console.log(`error`, error);
    }
  }

  async deleteTweetsOfUserWithoutPermission(userId: string) {
    try {
      const user = await this.usersService.findByIdAdmin(userId);
      return this.tweetModel.deleteMany({ author: user });
    } catch (error) {
      console.log(`error`, error);
    }
  }

  async reactTweet(id: string, user: UserDocument): Promise<any> {
    const tweet = await this.getTweet(id, user);
    if (!tweet) {
      return ResponseMessage('Tweet is not found', 'BAD_REQUEST');
    }

    const tweetId = tweet?._id?.toString();
    const userId = user?._id?.toString();

    const didUserLiked = tweet.likes.some(
      (userLiked: UserDocument) => userLiked?._id?.toString() === userId,
    );

    const updateQuery = didUserLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    const newTweet = await this.tweetModel
      .findByIdAndUpdate(tweetId, updateQuery, { new: true })
      .exec();

    return newTweet;
  }

  async saveTweet(id: string, user: UserDocument): Promise<any> {
    const userId = user?._id?.toString();
    const tweet = await this.getTweet(id, user);
    if (!tweet) {
      return ResponseMessage('Tweet is not found', 'BAD_REQUEST');
    }

    const tweetId = tweet?._id?.toString();
    const existedSavedUser = tweet.saved.some(
      (user: UserDocument) => user?._id?.toString() === userId,
    );

    const updateQuery = existedSavedUser
      ? { $pull: { saved: userId } }
      : { $push: { saved: userId } };

    const newTweet = await this.tweetModel
      .findByIdAndUpdate(tweetId, updateQuery, { new: true })
      .exec();

    return newTweet;
  }

  async reTweet(id: string, user: UserDocument): Promise<any> {
    const userId = user?._id?.toString();
    const tweet = await this.getTweet(id, user);
    if (!tweet) {
      return ResponseMessage('Tweet is not found', 'BAD_REQUEST');
    }

    tweet.retweeted.push(userId);
    const newTweet = new this.tweetModel({
      author: tweet.author,
      content: tweet.content,
      audience: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isRetweet: true,
      likes: [],
      media: tweet.media,
      tags: tweet.tags,
      retweet: [],
      retweetedBy: user,
    });

    const [oldTweetData, newTweetData] = await Promise.all([
      tweet.save(),
      newTweet.save(),
    ]);

    return newTweetData;
  }

  async createTweetByUserId(
    userId: string,
    createTweetData: CreateTweetDTO,
  ): Promise<TweetDocument | null> {
    const user = await this.usersService.findById(userId);
    if (user) {
      const tweet = await this.createTweet(createTweetData, user);
      return tweet;
    }

    return null;
  }

  async reportTweet(tweetId: string): Promise<TweetDocument | undefined> {
    const tweet = await this.tweetModel.findById(tweetId);
    if (!tweet) {
      return ResponseMessage('Tweet is not found', 'BAD_REQUEST');
    }

    tweet.reportedCount = +(tweet.reportedCount || 0) + 1;
    return await tweet.save();
  }

  /** QUERIES */

  async getTweet(
    id: string,
    user: UserDocument,
  ): Promise<TweetDocument | null | undefined> {
    // get tweet by id and populate author except password and passwordConfirm
    const tweet = await this.tweetModel
      .findById(id)
      .populate('author', 'name avatar coverPhoto followers gender')
      .populate('retweetedBy', 'name avatar coverPhoto')
      .populate('likes', 'name avatar bio')
      .populate('retweeted', 'name avatar bio')
      .populate('saved', 'name avatar bio')
      .exec();

    const userId = user?._id?.toString() || '';
    const { isRetweet, retweetedById, tweetAuthorId } =
      this.getInformationFromTweet(tweet as TweetDocument);

    // It is a public tweet then we will return without do anything else
    if (tweet?.audience === EAudienceConstant.PUBLIC) return tweet;

    // If not public , then we need these information for comparator steps below
    // First, if it is not exist, we will return null immediately without any comparator
    if (!user || !tweetAuthorId) return null;

    // If the user is an admin, they can access any tweet
    if (this.isAdminRole(user.role)) {
      return tweet;
    }

    const tweetAudience = JSON.stringify(tweet?.audience);

    switch (tweetAudience) {
      // if tweet is only me
      case String(EAudienceConstant.ONLY_ME):
        if (userId !== tweetAuthorId && isRetweet && userId !== retweetedById) {
          return ResponseMessage(
            'You are not the author of this tweet',
            'BAD_REQUEST',
          );
        }
        return tweet;
      // if tweet is only visible for followers
      case String(EAudienceConstant.FOLLOWERS): {
        if (userId === tweetAuthorId || this.isAdminRole(user.role)) {
          return tweet;
        }

        // check if user is following the author
        if (
          !tweet?.author?.followers?.some((u) => u._id.toString() === userId) &&
          !user?.following?.includes(tweetAuthorId)
        ) {
          return ResponseMessage(
            'You are not following the author of this tweet',
            'BAD_REQUEST',
          );
        }
        return tweet;
      }
      default:
        return null;
    }
  }

  async getTweetById(id: string): Promise<TweetDocument | null> {
    return this.tweetModel.findById(id).lean();
  }

  async getPublicOrFollowersOnlyTweets(
    user: UserDocument,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const following = user.following;
    const hasUser = user ? { author: user } : {};
    const isFollowers =
      (following?.length > 0 && {
        author: { $in: following },
        audience: EAudienceConstant.FOLLOWERS,
      }) ||
      {};

    const conditions = {
      $or: [
        {
          audience: EAudienceConstant.PUBLIC,
        },
        ...[isFollowers],
        ...[hasUser],
      ],
    };

    return this.findAllAndCount(option, conditions);
  }

  async getTweetsByUser(
    userId: string,
    option: QueryOption,
    userRequest: UserDocument,
  ): Promise<ResponseDTO> {
    const user = await this.usersService.findById(userId);
    const isUserRequestFollowingUser = userRequest?.following?.some(
      (u: UserDocument) => u._id.toString() === userId,
    );

    let conditions: any = {
      author: user,
      audience: EAudienceConstant.PUBLIC,
    };

    const userInDbId = user._id.toString();
    const userRequestId = userRequest?._id?.toString();

    if (userInDbId === userRequestId || isUserRequestFollowingUser) {
      conditions = {
        $or: [{ author: user, isRetweet: false }, { retweetedBy: user }],
      };
    }

    return this.findAllAndCount(option, conditions);
  }

  async getLatestTweets(
    user: UserDocument,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const following = user.following;
    const orConditions: any[] = [
      {
        audience: EAudienceConstant.PUBLIC,
      },
    ];

    if (following.length > 0) {
      const followingTweet = {
        author: { $in: following },
      };
      orConditions.push(followingTweet);
    }

    if (user) {
      const userTweet = {
        author: user,
      };
      orConditions.push(userTweet);
    }

    const conditions = {
      $or: orConditions,
    };
    option.sort = {
      ...option.sort,
      modifiedAt: -1,
    };

    return this.findAllAndCount(option, conditions);
  }

  async getMostPopularTweets(
    user: UserDocument,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const following = user.following;
    const conditions = {
      $or: [
        { audience: 0 },
        ...((user?._id && [{ author: { $in: following } }]) || []),
      ],
    };

    const data = await this.tweetModel
      .aggregate([
        {
          $addFields: {
            likes_count: { $size: { $ifNull: ['$likes', []] } },
          },
        },
        {
          $sort: { likes_count: -1 },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: '$author',
        },
        {
          $match: conditions,
        },
      ])
      .skip(option.skip as number)
      .limit(option.limit as number)
      .exec();

    await this.tweetModel.populate(data, {
      path: 'retweetedBy',
      select: '_id name',
    });

    const total = await this.tweetModel.countDocuments(conditions);

    return { data, total };
  }

  async getSavedTweets(
    user: UserDocument,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const conditions = {
      saved: user._id,
    };
    return this.findAllAndCount(option, conditions);
  }

  async getLikedTweets(
    userId: string,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const user = await this.usersService.findById(userId);
    const conditions = {
      likes: user._id,
    };
    return this.findAllAndCount(option, conditions);
  }

  async getMostLikedTweets() {
    const data = await this.tweetModel
      .aggregate([
        {
          $addFields: {
            likes_count: { $size: { $ifNull: ['$likes', []] } },
          },
        },
        {
          $sort: { likes_count: -1 },
        },
      ])
      .skip(TWEET_SKIP_DEFAULT)
      .limit(TWEET_LIMIT_DEFAULT)
      .exec();

    return data;
  }

  async getMostSavedTweets() {
    const data = await this.tweetModel
      .aggregate([
        {
          $addFields: {
            saved_count: {
              $size: { $ifNull: ['$saved', []] },
            },
          },
        },
        {
          $sort: { saved_count: -1 },
        },
      ])
      .skip(TWEET_SKIP_DEFAULT)
      .limit(TWEET_LIMIT_DEFAULT)
      .exec();

    return data;
  }

  async getMostRetweetedTweets() {
    const data = await this.tweetModel
      .aggregate([
        {
          $addFields: {
            retweeted_count: {
              $size: { $ifNull: ['$retweeted', []] },
            },
          },
        },
        {
          $sort: { retweeted_count: -1 },
        },
      ])
      .skip(TWEET_SKIP_DEFAULT)
      .limit(TWEET_LIMIT_DEFAULT)
      .exec();

    return data;
  }

  async getTweetStatistic() {
    const [mostLikedTweets, mostSavedTweets, mostRetweetedTweets] =
      await Promise.all([
        this.getMostLikedTweets(),
        this.getMostSavedTweets(),
        this.getMostRetweetedTweets(),
      ]).catch((error: any) => {
        return [[], [], []];
      });

    const data = {
      mostLikedTweets,
      mostSavedTweets,
      mostRetweetedTweets,
    };

    return data;
  }

  async search(user: UserDocument, search: string, query: QueryPostOption) {
    const conditions = {
      content: { $regex: search, $options: 'i' },
      $or: [
        {
          audience: EAudienceConstant.PUBLIC,
        },
        {
          author: { $in: user.following },
        },
        {
          author: user,
        },
      ],
    };
    return this.findAllAndCount(query.options as QueryOption, conditions);
  }

  async getTweetsByHashTag(
    user: UserDocument,
    hashTag: string,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const following = user.following;

    const conditions = {
      $and: [
        {
          $or: [
            { audience: 0 },
            { author: { $in: following } },
            { author: user },
          ],
        },
        { tags: { $in: hashTag } },
      ],
    };
    return this.findAllAndCount(option, conditions);
  }

  async getReportedTweets() {
    const conditions = {
      reportedCount: { $gt: 0 },
    };
    return this.tweetModel
      .find(conditions)
      .populate('author', '_id name')
      .exec();
  }

  async getUserMedias(
    userParam: UserDocument,
    userId: string,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const isSameUser = userParam?._id?.toString() === userId;
    const user = isSameUser
      ? { ...userParam }
      : await this.usersService.findById(userId);

    const following = user.following;

    const conditions = {
      author: new ObjectId(userId),
      audience: isSameUser
        ? { $in: Object.values(EAudienceConstant) }
        : {
            $in: [EAudienceConstant.PUBLIC],
          },
    };

    if (!isSameUser) {
      const isUserFollowing = following?.some(
        (us: UserDocument) => us?._id?.toString() === userId,
      );
      conditions.audience = isUserFollowing
        ? { $in: [EAudienceConstant.PUBLIC, EAudienceConstant.FOLLOWERS] }
        : { $in: [EAudienceConstant.PUBLIC] };
    }

    const aggregation = [
      {
        $match: conditions,
      },
      ...this.getMediaAggregation(),
      {
        $match: {
          media_count: { $gt: 0 },
        },
      },
    ];

    const [data, [{ total = 0 } = {}] = []] = await Promise.all([
      this.tweetModel
        .aggregate(aggregation as any[])
        .skip(option.skip as number)
        .limit(option.limit as number)
        .exec(),
      this.tweetModel
        .aggregate([
          ...aggregation,
          {
            $count: 'total',
          },
        ] as any[])
        .exec(),
    ]);

    return { data, total };
  }

  async countTweetByHashTag(hashTag: string): Promise<number> {
    const conditions = {
      tags: hashTag,
    };
    return this.tweetModel.countDocuments(conditions).exec();
  }

  async countTweetByUser(userId: string): Promise<number> {
    const user = await this.usersService.findById(userId);
    const conditions = {
      author: user,
    };
    return this.tweetModel.countDocuments(conditions).exec();
  }
}
