import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'modules/token/token.service';
import { UsersService } from 'modules/users/users.service';
import { ObjectId } from 'mongodb';
import { PayloadDTO } from './dto';
import { JWT_EXP } from '../../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  /** COMMON FUNCTIONS */
  async generateAccessToken(
    userId,
    timestamp: number = Date.now(),
  ): Promise<string> {
    const jti = new ObjectId().toHexString();
    const payload = {
      sub: userId,
      jti,
    } as PayloadDTO;

    await this.tokenService.setJWTKey(userId, jti, JWT_EXP, timestamp);

    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
