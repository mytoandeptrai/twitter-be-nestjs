import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/users/entities';

export class SignUpResponseDTO {
  @ApiProperty()
  readonly user: User;
  @ApiProperty()
  readonly refreshToken: string;
}
