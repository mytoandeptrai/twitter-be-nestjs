import { ResponseDTO } from 'common';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { Hashtag, HashtagDocument } from './entities';
export declare class HashtagService {
    private readonly hashtagModel;
    constructor(hashtagModel: Model<HashtagDocument>);
    count({ conditions }?: {
        conditions?: any;
    }): Promise<number>;
    findAll(option: QueryOption, conditions?: any): Promise<Hashtag[]>;
    getMostPopularHashtags(limit: number): Promise<HashtagDocument[]>;
    findAllAndCount(option: QueryOption, conditions?: any): Promise<ResponseDTO>;
    search(search: string, query: QueryPostOption): Promise<ResponseDTO>;
    updateHashtag(count: number, hashtag: string): Promise<HashtagDocument>;
}
