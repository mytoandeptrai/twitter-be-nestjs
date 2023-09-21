import {
  Body,
  Controller,
  Delete,
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

  @Get('/reportedTweet')
  async getReportedTweets(): Promise<ResponseDTO> {
    const data = await this.tweetService.getReportedTweets();
    return ResponseTool.GET_OK(data);
  }

  @Get('/user/:userId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getTweetsByUser(
    @GetUser() user: UserDocument,
    @Param('userId') userId: string,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getTweetsByUser(
      userId,
      query.options as QueryOption,
      user,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Get('/popular')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getPopularTweets(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getMostPopularTweets(
      user,
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

  @Get('/hashtag/:name')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getTweetsByHashtag(
    @GetUser() user: UserDocument,
    @Param('name') name: string,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getTweetsByHashTag(
      user,
      name,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getNewsFeedTweets(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } =
      await this.tweetService.getPublicOrFollowersOnlyTweets(
        user,
        query.options as QueryOption,
      );
    return ResponseTool.GET_OK(data, total);
  }

  @Get('/user-medias/:userId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getUserMedias(
    @GetUser() user: UserDocument,
    @Param('userId') userId: string,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.tweetService.getUserMedias(
      user,
      userId,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(data, total);
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

  @Get('/count-by-hashtag/:name')
  async getCountByHashtag(@Param('name') name: string): Promise<ResponseDTO> {
    const count = await this.tweetService.countTweetByHashTag(name);
    return ResponseTool.GET_OK(count);
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

  @Delete('/:tweetId/without-permission')
  async deleteTweetWithoutPermission(
    @Param('tweetId') tweetId: string,
  ): Promise<ResponseDTO> {
    await this.tweetService.deleteTweetWithoutPermission(tweetId);
    return ResponseTool.DELETE_OK({ message: 'Tweet deleted' });
  }

  @Delete('/:tweetId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  async deleteTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
  ): Promise<ResponseDTO> {
    await this.tweetService.deleteTweet(tweetId, user);
    return ResponseTool.DELETE_OK({ message: 'Tweet deleted' });
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
