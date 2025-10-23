import { Controller, Delete, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseDTO } from 'common';
import { HelperService } from './helper.service';

@Controller('helper')
@ApiTags('Helper - Development Tools')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Delete('/clear-all-data')
  @ApiOperation({
    summary: 'Clear all data from database',
    description:
      '⚠️ WARNING: This will delete ALL data in the database. Use only in development/testing environment.',
  })
  @ApiOkResponse({
    description: 'All data cleared successfully',
    type: ResponseDTO,
    schema: {
      example: {
        data: {
          message: 'All data has been cleared successfully',
          deletedCollections: ['users', 'tweets', 'comments', 'notifications'],
          totalCollections: 15,
        },
        message: 'All data cleared successfully',
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to clear data',
    schema: {
      example: {
        error: 'Error message',
        message: 'Failed to clear all data',
        statusCode: 400,
      },
    },
  })
  async clearAllData(): Promise<ResponseDTO> {
    return this.helperService.clearAllData();
  }

  @Get('/database-info')
  @ApiOperation({
    summary: 'Get database information',
    description:
      'Get information about database collections and document counts',
  })
  @ApiOkResponse({
    description: 'Database information retrieved successfully',
    type: ResponseDTO,
    schema: {
      example: {
        data: {
          databaseName: 'twitter_db',
          totalCollections: 15,
          totalDocuments: 1250,
          collections: [
            { name: 'users', documentCount: 150 },
            { name: 'tweets', documentCount: 800 },
            { name: 'comments', documentCount: 300 },
          ],
        },
        message: 'Database info retrieved successfully',
        statusCode: 200,
      },
    },
  })
  async getDatabaseInfo(): Promise<ResponseDTO> {
    return this.helperService.getDatabaseInfo();
  }
}
