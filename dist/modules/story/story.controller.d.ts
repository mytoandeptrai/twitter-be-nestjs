import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { QueryPostOption } from 'tools';
import { StoryDTO } from './dto';
import { StoryService } from './story.service';
export declare class StoryController {
    private readonly storyService;
    constructor(storyService: StoryService);
    createStory(user: UserDocument, createStoryDto: StoryDTO): Promise<ResponseDTO>;
    getStories(user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    getMeStories(user: UserDocument, query: QueryPostOption): Promise<ResponseDTO>;
    updateStory(user: UserDocument, id: string): Promise<ResponseDTO>;
    deleteStory(user: UserDocument, id: string): Promise<ResponseDTO>;
}
