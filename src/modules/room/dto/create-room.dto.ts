import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isDm: boolean;

  @IsBoolean()
  isPrivate: boolean;

  @IsString()
  image?: string;

  @IsArray()
  members?: string[];
}
