import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { Model } from 'mongoose';
import { QueryOption } from 'tools';
import { ResponseMessage } from 'utils';
import { EAudienceConstant, ROOT_ROLES } from '../../constants';
import { CreateTweetDTO } from './dto';
import { Tweet, TweetDocument } from './entities';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name)
    private readonly tweetModel: Model<TweetDocument>,
    private readonly userService: UsersService,
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
    const tweetAuthorId = tweet?.author?._id?.toString() || '';
    const isRetweet = tweet?.isRetweet || false;
    const retweetedById =
      (isRetweet && tweet?.retweetedBy?._id?.toString()) || '';

    // It is a public tweet then we will return without do anything else
    if (tweet?.audience === EAudienceConstant.PUBLIC) return tweet;

    // If not public , then we need these information for comparator steps below
    // First, if it is not exist, we will return null immediately without any comparator
    if (!user || !tweetAuthorId) return null;

    const tweetAudience = JSON.stringify(tweet?.audience);

    switch (tweetAudience) {
      // if tweet is only me
      case String(EAudienceConstant.ONLY_ME):
        if (user?.role === 'admin') return tweet;
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
}
