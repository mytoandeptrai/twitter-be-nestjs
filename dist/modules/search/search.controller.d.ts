import { UserDocument } from 'modules/users/entities';
import { QueryPostOption } from 'tools';
import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(user: UserDocument, querySearch: any, query: QueryPostOption): Promise<import("common").ResponseDTO>;
}
