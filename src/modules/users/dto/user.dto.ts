import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EGender } from '../../../constants';
import { REGEX_PASSWORD, USER_CONST } from '../constants';

export class UserDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(USER_CONST.NAME_MAX_LENGTH)
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  bio: string;

  @ApiProperty()
  gender: EGender;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  coverPhoto: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(REGEX_PASSWORD, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(REGEX_PASSWORD, {
    message: 'Password too weak',
  })
  passwordConfirm: string;
}
