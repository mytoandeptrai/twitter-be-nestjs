import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/users/entities';

export class AccessTokenResponse {
  @ApiProperty()
  user: User;
  @ApiProperty()
  accessToken: string;
}
