import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROOT_ROLES } from '../../constants';
import { TokenExpiredError } from 'jsonwebtoken';
import { ResponseMessage } from 'utils';

@Injectable()
export class MyAdminTokenAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (err) throw err;
    if (info instanceof TokenExpiredError) {
      return ResponseMessage('Token has expired', 'UNAUTHORIZED');
    }

    if (!ROOT_ROLES.includes(user?.role)) {
      return ResponseMessage('You are not an admin !', 'METHOD_NOT_ALLOWED');
    }

    return user;
  }
}
