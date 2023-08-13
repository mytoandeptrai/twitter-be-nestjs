import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiQueryGetMany,
  MyTokenAuthGuard,
  QueryGet,
  ResponseDTO,
} from 'common';
import { GetUser } from 'modules/users/decorators';
import { UserDocument } from 'modules/users/entities';
import { QueryOption, QueryPostOption, ResponseTool } from 'tools';
import { CreateTweetDTO, UpdateTweetDto } from './dto';
import { TweetService } from './tweet.service';

@Controller('tweet')
@ApiTags('Tweets')
@ApiBearerAuth()
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}
  @Get('/tweet-statistic')
  async getTweetStatistics(): Promise<ResponseDTO> {
    const statistics = await this.tweetService.getTweetStatistic();
    return ResponseTool.GET_OK(statistics);
  }

  @Get('/:tweetId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async getTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
  ): Promise<ResponseDTO> {
    const tweet = await this.tweetService.getTweet(tweetId, user);
    return ResponseTool.GET_OK(tweet);
  }

  @Get('/user/saved')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getMySavedTweets(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getSavedTweets(
      user,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Get('/liked/:userId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getMyLikedTweets(
    @Param('userId') userId: string,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getLikedTweets(
      userId,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Get('/latest')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getLatestTweets(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getLatestTweets(
      user,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Post()
  @ApiOkResponse({
    type: ResponseDTO,
  })
  @UseGuards(MyTokenAuthGuard)
  async createTweet(
    @GetUser() user: UserDocument,
    @Body() createTweetDto: CreateTweetDTO,
  ): Promise<ResponseDTO> {
    const newTweet = await this.tweetService.createTweet(createTweetDto, user);
    return ResponseTool.POST_OK(newTweet);
  }

  @Patch('/:tweetId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async updateTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
    @Body() updatedData: UpdateTweetDto,
  ): Promise<ResponseDTO> {
    const updatedTweet = await this.tweetService.updateTweet(
      tweetId,
      updatedData,
      user,
    );
    return ResponseTool.PATCH_OK(updatedTweet);
  }

  @Patch('/report/:tweetId')
  async reportTweet(@Param('tweetId') tweetId: string): Promise<ResponseDTO> {
    const tweet = await this.tweetService.reportTweet(tweetId);
    return ResponseTool.PATCH_OK(tweet);
  }

  @Post('/react/:tweetId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async reactToTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
  ): Promise<ResponseDTO> {
    return ResponseTool.POST_OK(
      await this.tweetService.reactTweet(tweetId, user),
    );
  }

  @Post('/retweet/:tweetId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async retweetTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
  ): Promise<ResponseDTO> {
    return ResponseTool.POST_OK(await this.tweetService.reTweet(tweetId, user));
  }

  @Post('/save/:tweetId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async saveTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
  ): Promise<ResponseDTO> {
    return ResponseTool.POST_OK(
      await this.tweetService.saveTweet(tweetId, user),
    );
  }
}
