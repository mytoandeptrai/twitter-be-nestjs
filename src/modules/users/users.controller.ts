import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'common';
import { MyTokenAuthGuard } from 'common/guards';
import { ResponseTool } from 'tools';
import { GetUser } from './decorators';
import { RegisterUserDTO, UserDTO } from './dto';
import { User, UserDocument } from './entities';
import { UsersService } from './users.service';

@Controller('user')
@ApiTags('Apis User')
export class UserController {
  constructor(private userService: UsersService) {}

  @Post('/register')
  @ApiCreatedResponse({
    type: UserDTO,
  })
  async createUser(@Body() user: RegisterUserDTO): Promise<ResponseDTO> {
    return ResponseTool.CREATED(
      await this.userService.createUser(user as User),
    );
  }

  @Post('/follow/:userId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiCreatedResponse({ type: ResponseDTO })
  async followUser(
    @GetUser() user: UserDocument,
    @Param('userId') userToFollowId: string,
  ): Promise<ResponseDTO> {
    return ResponseTool.POST_OK(
      await this.userService.followUser(user, userToFollowId),
    );
  }

  @Post('/un-follow/:userId')
  @ApiBearerAuth()
  @UseGuards(MyTokenAuthGuard)
  @ApiCreatedResponse({ type: ResponseDTO })
  async unFollowUser(
    @GetUser() user: UserDocument,
    @Param('userId') userToUnFollowId: string,
  ): Promise<ResponseDTO> {
    return ResponseTool.POST_OK(
      await this.userService.unFollowUser(user, userToUnFollowId),
    );
  }
}
