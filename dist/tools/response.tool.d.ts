import { ResponseDTO } from 'common';
import { HttpException } from '@nestjs/common';
export declare class ResponseTool {
    static RESPONSE(data: any, total?: number): ResponseDTO;
    static GET_OK(data?: any, total?: number, message?: string): ResponseDTO;
    static POST_OK(data: any, total?: number, message?: string): ResponseDTO;
    static CREATED(data: any, message?: string): ResponseDTO;
    static PUT_OK(data: any, message?: string): ResponseDTO;
    static DELETE_OK(data: any, message?: string): ResponseDTO;
    static PATCH_OK(data: any, message?: string): ResponseDTO;
    static ERROR(error: HttpException, statusCode: number, message?: string): ResponseDTO;
    static BAD_REQUEST(message: string, error: HttpException): ResponseDTO;
    static UNAUTHORIZED(message: string, error: HttpException): ResponseDTO;
    static NOT_FOUND(message: string, error: HttpException): ResponseDTO;
    static CONFLICT(message: string, error: HttpException): ResponseDTO;
}
