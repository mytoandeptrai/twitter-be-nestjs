import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'common';
import { ResponseTool } from 'tools';
import { RegisterUserDTO } from './dto';
import { User } from './entities';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Apis Users ')
export class UserController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() user: RegisterUserDTO): Promise<ResponseDTO> {
    return ResponseTool.CREATED(
      await this.userService.createUser(user as User),
    );
  }

  @Get('')
  async getUsers() {
    const dummyData: any[] = [
      {
        uid: new Date().getTime().toString(),
        firstName: 'John',
        lastName: 'Module',
      },
      {
        uid: new Date().getTime().toString(),
        firstName: 'Alex',
        lastName: 'Alex said',
      },
    ];
    return dummyData;
  }
}
