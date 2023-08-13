import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TweetService } from './tweet.service';

@Controller('tweet')
@ApiTags('Tweets')
@ApiBearerAuth()
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}
}
