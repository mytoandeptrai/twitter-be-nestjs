import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiQueryGetMany, MyTokenAuthGuard, QueryGet } from 'common';
import { GetUser } from 'modules/users/decorators';
import { UserDocument } from 'modules/users/entities';
import { QueryPostOption, ResponseTool } from 'tools';
import { SearchService } from './search.service';

@Controller('search')
@ApiTags('Search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async search(
    @GetUser() user: UserDocument,
    @Query() querySearch,
    @QueryGet() query: QueryPostOption,
  ) {
    const searchQuery = {
      search: querySearch.search,
      category: querySearch.category,
    };

    const { data, total } = await this.searchService.search(
      user,
      searchQuery,
      query,
    );

    return ResponseTool.GET_OK(data, total);
  }
}
