import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseTool } from 'tools';
import { POPULAR_HASH_TAGS_NUMBER } from './constants';
import { UpdateHashtagDto } from './dto';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
@ApiTags('HashTags')
export class HashtagController {
  @Inject()
  private readonly hashtagService: HashtagService;

  @Get('/most-popular')
  async getMostPopularHashtags() {
    const popularHashtags = await this.hashtagService.getMostPopularHashtags(
      POPULAR_HASH_TAGS_NUMBER,
    );
    return ResponseTool.GET_OK(popularHashtags);
  }

  @Patch('/:name')
  async updateHashtag(
    @Body()
    body: UpdateHashtagDto,
    @Param('name') name: string,
  ) {
    const count = parseInt(body.count);
    const updatedHashtag = await this.hashtagService.updateHashtag(count, name);
    return ResponseTool.PATCH_OK(updatedHashtag);
  }
}
