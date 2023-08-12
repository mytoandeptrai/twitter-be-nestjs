import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipeTransform implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async transform(value: any) {
    if (value === null || value === undefined) {
      return null;
    }

    if (Types.ObjectId.isValid(value)) return value;

    throw new BadRequestException(
      ObjectIdPipeTransform.name,
      'It is not objectId',
    );
  }
}
