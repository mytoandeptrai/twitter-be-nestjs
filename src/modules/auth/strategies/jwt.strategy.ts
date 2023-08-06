import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenService } from 'modules/token/token.service';
import { User } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadDTO } from '../dto';
import { JWT_SECRET, MSG } from './../../../constants';
import { ResponseMessage } from 'utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: PayloadDTO): Promise<User> {
    const { sub, jti } = payload;
    const user = await this.userService.findById(sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    user.jti = payload.jti;
    const checkJwt = await this.tokenService.checkJWTKey(sub, jti);
    if (!checkJwt) {
      return ResponseMessage(`${MSG.FRONTEND.UN_AUTHORIZED}`, 'UNAUTHORIZED');
    }
    return user;
  }
}
