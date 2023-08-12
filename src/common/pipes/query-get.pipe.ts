import { Injectable, PipeTransform } from '@nestjs/common';
import { CURRENT_PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from '../../constants';
import { QueryPostOption, QueryPreOption } from 'tools';

interface ISelectInterface {
  [field: string]: 0 | 1;
}

interface ISortOptionInterface {
  [field: string]: 1 | -1;
}

@Injectable()
export class QueryGetPipe
  implements PipeTransform<QueryPreOption, QueryPostOption>
{
  private readonly defaultSortOrder = (field: string): -1 | 1 =>
    ['updatedAt', 'createdAt', '_id'].includes(field) ? -1 : 1;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: QueryPreOption): QueryPostOption {
    const isDefault = !value.custom || value.custom === '0';

    // Select fields
    const select = ((selectValue: string): ISelectInterface => {
      const res: ISelectInterface = {};
      if (selectValue) {
        selectValue.split(' ').forEach((field) => {
          if (field.charAt(0) === '-') {
            res[field.slice(1)] = 0;
          } else {
            res[field] = 1;
          }
        });
      }
      return res;
    })(value.select as string);

    // Sort options
    const fields = ((sort: string): string[] => {
      if (!sort) {
        return isDefault ? ['updatedAt'] : [];
      }
      return sort.split(' ');
    })(value.sort as string);

    const orders = ((
      orderString: string,
      fieldArray: string[],
    ): Array<-1 | 1> => {
      const res: Array<-1 | 1> = orderString
        ? orderString.split(' ').map((ord) => (ord === '-1' ? -1 : 1))
        : [];
      for (let i = res.length; i < fieldArray.length; ++i) {
        res.push(this.defaultSortOrder(fieldArray[i]));
      }
      return res;
    })(value.order as string, fields);

    const sortOption: ISortOptionInterface = {};
    for (const [i, field] of fields.entries()) {
      sortOption[field] = orders[i];
    }
    sortOption.updatedAt = sortOption.updatedAt || -1;

    // Find conditions
    const conditions = (value.cond && JSON.parse(value.cond)) || {};

    // Pagination
    const page = Number(value.page) * 1 || CURRENT_PAGE_DEFAULT;
    const limit = Number(value.limit) * 1 || PAGE_SIZE_DEFAULT;
    const skip = page && (page - 1) * limit;

    const result: QueryPostOption = {
      conditions,
      options: {
        select,
        sort: sortOption,
        skip,
        limit,
      },
    };
    return result;
  }
}
