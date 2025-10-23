import { PipeTransform } from '@nestjs/common';
import { QueryPostOption, QueryPreOption } from 'tools';
export declare class QueryGetPipe implements PipeTransform<QueryPreOption, QueryPostOption> {
    private readonly defaultSortOrder;
    transform(value: QueryPreOption): QueryPostOption;
}
