import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StoryDTO {
  @IsString()
  content: string;

  @ApiProperty()
  audience: number;
}
