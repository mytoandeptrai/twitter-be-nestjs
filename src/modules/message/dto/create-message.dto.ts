import { IsString } from 'class-validator';
import { UserDocument } from 'modules/users/entities';

export class CreateMessageDTO {
  @IsString()
  content: string;

  @IsString()
  file: string;

  @IsString()
  roomId: string;

  author: UserDocument;
}
