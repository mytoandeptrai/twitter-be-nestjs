import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import { EAudienceConstant } from '../../constants';
import { UserDocument } from 'modules/users/entities';
import { Model } from 'mongoose';
import { QueryOption } from 'tools';
import { Story, StoryDocument } from './entities';
import { ONE_DAY_HOURS } from './constants';
import { StoryDTO } from './dto';
import { ResponseMessage } from 'utils';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name)
    private storyModel: Model<StoryDocument>,
  ) {}
  /** COMMON FUNCTIONS */
  async findAll(
    option: QueryOption,
    conditions: any = {},
  ): Promise<StoryDocument[]> {
    const results = await this.storyModel
      .find(conditions)
      .sort(option.sort)
      .skip(option.skip as number)
      .limit(option.limit as number)
      .populate('owner', '_id name avatar');

    return results;
  }

  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.storyModel.countDocuments(conditions).exec()
      : this.storyModel.estimatedDocumentCount().exec();
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

  /** QUERIES */

  async findStory(id: string): Promise<StoryDocument | null> {
    return await this.storyModel.findById(id).exec();
  }

  async getStories(
    user: UserDocument,
    query: QueryOption,
  ): Promise<StoryDocument[]> {
    /** get all stories where audience is public or followers if has user then create it with created at within the last 24h */
    const currentTime = new Date();
    const yesterday = new Date(currentTime.getTime() - ONE_DAY_HOURS);
    const following = user.following;

    const audienceConditions: any[] = [{ audience: EAudienceConstant.PUBLIC }];

    if (user && following.length > 0) {
      const followingConditions = {
        audience: EAudienceConstant.FOLLOWERS,
        owner: { $in: following },
      };

      audienceConditions.push(followingConditions);
    }

    if (user) {
      audienceConditions.push({ owner: user });
    }

    const timeCondition = { createdAt: { $gte: yesterday } };

    const conditions = {
      $or: audienceConditions,
      ...timeCondition,
    };

    return this.findAll(query, conditions);
  }

  async getMeStories(
    user: UserDocument,
    query: QueryOption,
  ): Promise<StoryDocument[]> {
    const conditions = {
      owner: user,
    };

    return this.findAll(query, conditions);
  }

  /** MUTATIONS */

  async createStory(
    createStoryDto: StoryDTO,
    user: UserDocument,
  ): Promise<StoryDocument> {
    try {
      const story = new this.storyModel(createStoryDto);
      story.audience = createStoryDto.audience;
      story.owner = user;
      story.createdAt = new Date();
      const newStory = await story.save();

      return newStory;
    } catch (error) {
      return ResponseMessage(`Server Error`, 'SERVICE_UNAVAILABLE');
    }
  }

  async updateStory(id: string, user: UserDocument) {
    const userId = user._id;
    const story = await this.storyModel.findById(id);

    if (!story) {
      return ResponseMessage(`The story is not found`, 'BAD_REQUEST');
    }

    if (!story.viewerIds.some((v) => v.toString() === userId.toString())) {
      story.viewerIds.push(userId);
      return await story.save();
    }
  }

  async deleteStory(id: string, user: UserDocument) {
    const story = await this.storyModel.findById(id);
    if (!story) {
      return ResponseMessage(`The story is not found`, 'BAD_REQUEST');
    }

    if (story.owner.toString() !== user._id.toString()) {
      return ResponseMessage(
        `You are not the owner of this story`,
        'BAD_REQUEST',
      );
    }
    return await this.storyModel.findByIdAndDelete(id);
  }
}
