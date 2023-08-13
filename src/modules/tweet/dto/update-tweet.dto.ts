import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EAudienceConstant } from '../../../constants';

export enum EUpdateTweetType {
  CONTENT = 'content',
  RETWEET = 'retweet',
  REACT = 'react',
  SAVE = 'save',
  SHARE = 'share',
}

export class UpdateTweetDto {
  @ApiProperty({
    type: 'enum',
    enum: EUpdateTweetType,
  })
  type: EUpdateTweetType;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  content: string;

  @IsOptional()
  @ApiPropertyOptional({
    isArray: true,
    type: String,
  })
  tags: string[];

  @IsOptional()
  @ApiPropertyOptional({
    isArray: true,
    type: String,
  })
  media: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: 'enum',
    enum: Object.values(EAudienceConstant),
  })
  audience: number;
}
