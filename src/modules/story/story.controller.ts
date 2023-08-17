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
import { ApiResponse } from '@nestjs/swagger';
import {
  ApiQueryGetMany,
  MyTokenAuthGuard,
  QueryGet,
  ResponseDTO,
} from 'common';
import { GetUser } from 'modules/users/decorators';
import { UserDocument } from 'modules/users/entities';
import { QueryOption, QueryPostOption, ResponseTool } from 'tools';
import { StoryDTO } from './dto';
import { StoryService } from './story.service';

@Controller('/story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post('')
  @ApiResponse({
    type: ResponseDTO,
  })
  @UseGuards(MyTokenAuthGuard)
  async createStory(
    @GetUser() user: UserDocument,
    @Body() createStoryDto: StoryDTO,
  ): Promise<ResponseDTO> {
    const newStory = await this.storyService.createStory(createStoryDto, user);
    return ResponseTool.POST_OK(newStory);
  }

  @Get('')
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getStories(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const stories = await this.storyService.getStories(
      user,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(stories);
  }

  @Get('/me')
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getMeStories(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ): Promise<ResponseDTO> {
    const stories = await this.storyService.getMeStories(
      user,
      query.options as QueryOption,
    );
    return ResponseTool.GET_OK(stories);
  }

  @Patch('/:id')
  @UseGuards(MyTokenAuthGuard)
  async updateStory(
    @GetUser() user: UserDocument,
    @Param('id') id: string,
  ): Promise<ResponseDTO> {
    const updatedStory = await this.storyService.updateStory(id, user);
    return ResponseTool.PATCH_OK(updatedStory);
  }

  @Delete('/:id')
  @UseGuards(MyTokenAuthGuard)
  async deleteStory(
    @GetUser() user: UserDocument,
    @Param('id') id: string,
  ): Promise<ResponseDTO> {
    const deletedStory = await this.storyService.deleteStory(id, user);
    return ResponseTool.DELETE_OK(deletedStory);
  }
}
