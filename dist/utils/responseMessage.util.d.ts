import { HttpStatus } from '@nestjs/common';
export declare const ResponseMessage: (error: string, status: keyof typeof HttpStatus) => never;
