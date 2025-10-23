import { UpdateHashtagDto } from './dto';
export declare class HashtagController {
    private readonly hashtagService;
    getMostPopularHashtags(): Promise<import("../../common").ResponseDTO>;
    updateHashtag(body: UpdateHashtagDto, name: string): Promise<import("../../common").ResponseDTO>;
}
