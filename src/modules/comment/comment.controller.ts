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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiQueryGetMany,
  MyTokenAuthGuard,
  QueryGet,
  ResponseDTO,
} from 'common';
import { GetUser } from 'modules/users/decorators';
import { UserDocument } from 'modules/users/entities';
import { QueryPostOption, ResponseTool } from 'tools';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto';

@Controller('comment')
@ApiTags('Comments')
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/user')
  @ApiResponse({ type: ResponseDTO })
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getCommentsByUser(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.commentService.findCommentsByUser(
      user,
      query,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Get('/:tweetId')
  @ApiOkResponse({ type: ResponseDTO })
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getCommentsByTweet(
    @GetUser() user: UserDocument,
    @Param('tweetId') tweetId: string,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const { data, total } = await this.commentService.findCommentsByTweetId(
      tweetId,
      user,
      query,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Patch('/:commentId/react')
  @UseGuards(MyTokenAuthGuard)
  async reactComment(
    @GetUser() user: UserDocument,
    @Param('commentId') commentId: string,
  ) {
    const reactComment = await this.commentService.reactComment(
      user,
      commentId,
    );
    return ResponseTool.PATCH_OK(reactComment);
  }

  @Post('/:tweetId')
  @ApiOkResponse({ type: ResponseDTO })
  @UseGuards(MyTokenAuthGuard)
  async postComment(
    @Param('tweetId') tweetId: string,
    @GetUser() user: UserDocument,
    @Body() commentDto: CreateCommentDTO,
  ) {
    const newComment = await this.commentService.createComment(
      commentDto,
      user,
      tweetId,
    );
    return ResponseTool.POST_OK(newComment);
  }

  @Patch('/:commentId')
  @ApiOkResponse({ type: ResponseDTO })
  @UseGuards(MyTokenAuthGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @GetUser() user: UserDocument,
    @Body() commentDto: CreateCommentDTO,
  ) {
    const updatedComment = await this.commentService.updateComment(
      commentId,
      commentDto,
      user,
    );
    return ResponseTool.PATCH_OK(updatedComment);
  }

  @Delete('/:commentId')
  @ApiOkResponse({ type: ResponseDTO })
  @UseGuards(MyTokenAuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser() user: UserDocument,
  ) {
    await this.commentService.deleteComment(commentId, user);
    return ResponseTool.DELETE_OK({
      message: 'OK',
    });
  }
}
