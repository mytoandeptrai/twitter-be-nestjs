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
import { QueryPostOption, ResponseTool } from 'tools';
import { CreateNotificationDTO } from './dto';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiQueryGetMany()
  async getAll(
    @GetUser() user: UserDocument,
    @QueryGet() query: QueryPostOption,
  ) {
    const { data, total } = await this.notificationService.getAllNotifications(
      user._id,
      query,
    );
    return ResponseTool.GET_OK(data, total);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiOkResponse({
    type: ResponseDTO,
  })
  async create(
    @GetUser() user: UserDocument,
    @Body() notificationDto: CreateNotificationDTO,
  ) {
    return this.notificationService.createNotification(user, notificationDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiOkResponse({
    type: ResponseDTO,
  })
  async deleteAll(@GetUser() user: UserDocument) {
    await this.notificationService.deleteAllNotifications(user._id);
    return ResponseTool.DELETE_OK({
      message: 'OK',
    });
  }

  @Patch('/read')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiOkResponse({
    type: ResponseDTO,
  })
  async readMultiNotifications(
    @GetUser() user: UserDocument,
    @Body('ids') ids: string[],
  ) {
    const updatedNotification =
      await this.notificationService.updateReadStatusAllNotifications(
        user._id,
        ids,
      );
    return ResponseTool.PATCH_OK(updatedNotification);
  }

  @Patch('/read/:id')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiOkResponse({
    type: ResponseDTO,
  })
  async read(@GetUser() user: UserDocument, @Param('id') id: string) {
    const updatedNotification =
      await this.notificationService.updateReadStatusSingleNotification(
        user._id,
        id,
      );
    return ResponseTool.PATCH_OK(updatedNotification);
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: ResponseDTO,
  })
  async delete(@Param('id') id: string) {
    const deletedNotification =
      await this.notificationService.deleteSingleNotification(id);
    return ResponseTool.DELETE_OK(deletedNotification);
  }
}
