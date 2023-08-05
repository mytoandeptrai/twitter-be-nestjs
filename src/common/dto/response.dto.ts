import { ApiProperty } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';

export class ResponseDTO {
  @ApiProperty()
  readonly data?: any;

  @ApiProperty()
  readonly total?: number;

  @ApiProperty()
  readonly error?: HttpException;

  @ApiProperty()
  readonly message?: string;

  @ApiProperty()
  readonly statusCode?: number;
}
