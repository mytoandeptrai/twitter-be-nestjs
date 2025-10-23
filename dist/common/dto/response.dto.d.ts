import { HttpException } from '@nestjs/common';
export declare class ResponseDTO {
    readonly data?: any;
    readonly total?: number;
    readonly error?: HttpException;
    readonly message?: string;
    readonly statusCode?: number;
}
