import { LRUCache } from 'lru-cache';
export declare class LinkPreviewService {
    cache: LRUCache<string, any>;
    constructor();
    getLinkMetadata(url: string): Promise<any>;
}
