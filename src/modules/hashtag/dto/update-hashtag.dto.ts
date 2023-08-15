import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateHashtagDto {
  @ApiProperty()
  @IsNumber()
  count: string;
}
