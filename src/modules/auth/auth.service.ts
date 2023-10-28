import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'modules/token/token.service';
import { UserDTO } from 'modules/users/dto';
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { ObjectId } from 'mongodb';
import { ResponseMessage } from 'utils';
import { AVATAR_URL, JWT_EXP, MSG } from '../../constants';
import { AccessTokenResponse, LoginDTO, PayloadDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  /** COMMON FUNCTIONS */

  async generateAccessToken(
    userId: string,
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

  async verifyAccessToken(accessToken: string) {
    const verifiedToken = await this.jwtService.verify(accessToken);
    if (!verifiedToken) {
      return false;
    }
    const { sub, jti } = verifiedToken;
    const checkJwt = await this.tokenService.checkJWTKey(sub, jti);
    return checkJwt;
  }

  /** MUTATIONS */

  async signUp(
    userDto: UserDTO,
    timestamp: number = Date.now(),
  ): Promise<AccessTokenResponse> {
    const userBody = {
      ...userDto,
      avatar: AVATAR_URL,
      isThirdParty: false,
    };

    const newUser = await this.userService.createUser(userBody);
    const accessToken = await this.generateAccessToken(newUser.id, timestamp);

    return {
      user: newUser,
      accessToken,
    };
  }

  async signIn(
    loginDto: LoginDTO,
    timestamp: number = Date.now(),
  ): Promise<AccessTokenResponse> {
    const { username, password } = loginDto;
    const currentUser = await this.userService.findByUsernameOrEmail(username);

    if (!currentUser || currentUser?.status?.toString() !== 'active') {
      return ResponseMessage(`${MSG.FRONTEND.USER_NOT_FOUND}`, 'BAD_REQUEST');
    }

    const isCorrectPassword = await currentUser.comparePassword(password);
    if (!isCorrectPassword) {
      return ResponseMessage(`${MSG.FRONTEND.WRONG_PASSWORD}`, 'UNAUTHORIZED');
    }

    const accessToken = await this.generateAccessToken(
      currentUser.id,
      timestamp,
    );
    return {
      user: currentUser,
      accessToken,
    };
  }

  async logout(user: UserDocument): Promise<{ message: string }> {
    try {
      await Promise.all([
        this.tokenService.deleteJWTKey(user.id, user.jti),
        this.tokenService.deleteExpiredJWTKeys(),
      ]);

      return {
        message: 'Good bye :)',
      };
    } catch (error) {
      return {
        message: 'Logout Error -_-',
      };
    }
  }
}
