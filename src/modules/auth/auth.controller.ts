import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenResponse, LoginDTO } from './dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserDTO } from 'modules/users/dto';
import { MyTokenAuthGuard } from 'common/guards';
import { UserDocument } from 'modules/users/entities';
import { GetUser } from 'modules/users/decorators';

@Controller('auth')
@ApiTags('Apis Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @ApiOkResponse({
    type: AccessTokenResponse,
  })
  async signUp(@Body() userDto: UserDTO): Promise<AccessTokenResponse> {
    return this.authService.signUp(userDto);
  }

  @Post('/signin')
  @ApiOkResponse({
    type: AccessTokenResponse,
  })
  async signIn(@Body() loginDTO: LoginDTO): Promise<AccessTokenResponse> {
    return this.authService.signIn(loginDTO);
  }

  @Post('/logout')
  @ApiOkResponse()
  @UseGuards(MyTokenAuthGuard)
  async logout(@GetUser() user): Promise<{ message: string }> {
    console.log('🚀 ~ file: auth.controller.ts:33 ~ logout ~ user:', user);
    // return await this.authService.logout(user as UserDocument);
    return {
      message: 'Ok em',
    };
  }
}
