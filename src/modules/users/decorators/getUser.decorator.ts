import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../entities';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDocument => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
