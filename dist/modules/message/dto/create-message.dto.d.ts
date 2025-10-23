import { UserDocument } from 'modules/users/entities';
export declare class CreateMessageDTO {
    content: string;
    file: string;
    roomId: string;
    author: UserDocument;
}
