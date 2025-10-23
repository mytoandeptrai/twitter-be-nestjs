import { ResponseDTO } from 'common';
import { QueryPostOption } from 'tools';
import { MessageService } from './message.service';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    getRoomMessages(roomId: string, query: QueryPostOption): Promise<ResponseDTO>;
}
