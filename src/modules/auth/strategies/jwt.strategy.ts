import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET } from '../../../constants';
import { TokenService } from 'modules/token/token.service';
import { UsersService } from 'modules/users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadDTO } from '../dto';
import { User } from 'modules/users/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      throw new UnauthorizedException('Invalid Jwt Token');
    }
    return user;
  }
}
