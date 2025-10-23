import { PipeTransform } from '@nestjs/common';
export declare class ObjectIdPipeTransform implements PipeTransform {
    constructor();
    transform(value: any): Promise<any>;
}
