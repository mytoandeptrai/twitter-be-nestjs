import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { Hashtag, HashtagDocument } from './entities';

@Injectable()
export class HashtagService {
  constructor(
    @InjectModel(Hashtag.name)
    private readonly hashtagModel: Model<HashtagDocument>,
  ) {}

  /** COMMONS */
  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.hashtagModel.countDocuments(conditions).exec()
      : this.hashtagModel.estimatedDocumentCount().exec();
  }

  async findAll(option: QueryOption, conditions: any = {}): Promise<Hashtag[]> {
    return this.hashtagModel
      .find(conditions)
      .sort(option.sort)
      .skip(option.skip as number)
      .limit(option.limit as number);
  }

  /** QUERIES */

  async getMostPopularHashtags(limit: number): Promise<HashtagDocument[]> {
    return await this.hashtagModel
      .find({
        count: { $gt: 0 },
      })
      .sort({ count: -1 })
      .limit(limit);
  }

  async findAllAndCount(
    option: QueryOption,
    conditions: any = {},
  ): Promise<ResponseDTO> {
    const data = await this.findAll(option, conditions);
    const total = await this.count({ conditions });
    return { data, total };
  }

  async search(search: string, query: QueryPostOption) {
    const conditions = {
      name: { $regex: search, $options: 'i' },
      count: { $gt: 0 },
    };

    return this.findAllAndCount(query.options as QueryOption, conditions);
  }

  /** MUTATIONS */

  async updateHashtag(
    count: number,
    hashtag: string,
  ): Promise<HashtagDocument> {
    const hashtagDoc = await this.hashtagModel.findOne({
      name: hashtag,
    });

    if (!hashtagDoc) {
      return this.hashtagModel.create({
        name: hashtag,
        count,
      });
    }
    hashtagDoc.count += count;
    return await hashtagDoc.save();
  }
}
