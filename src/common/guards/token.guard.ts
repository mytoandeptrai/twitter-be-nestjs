import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { ResponseMessage } from 'utils';

@Injectable()
export class MyTokenAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (err) throw err;
    if (info instanceof TokenExpiredError) {
      return ResponseMessage('Token has expired', 'UNAUTHORIZED');
    }
    return user;
  }
}
