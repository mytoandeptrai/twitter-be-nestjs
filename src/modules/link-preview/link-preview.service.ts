import { BadRequestException, Injectable } from '@nestjs/common';
import { parser } from 'html-metadata-parser';
import { LRUCache } from 'lru-cache';
import { isValidUrl, parseJson } from 'utils';
import { options } from './constants';

@Injectable()
export class LinkPreviewService {
  cache: LRUCache<string, any>;
  constructor() {
    this.cache = new LRUCache(options);
  }

  async getLinkMetadata(url: string): Promise<any> {
    if (!isValidUrl(url)) {
      throw new BadRequestException('Invalid url');
    }
    const cached = this.cache.get(url);
    if (cached) {
      return parseJson(cached);
    }
    const metadata = await parser(url);
    this.cache.set(url, JSON.stringify(metadata));
    return metadata;
  }
}
