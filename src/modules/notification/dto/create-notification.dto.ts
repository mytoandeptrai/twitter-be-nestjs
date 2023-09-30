import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNotificationDTO {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  image?: string;
}
