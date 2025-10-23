import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'modules/token/token.service';
import { UserDTO } from 'modules/users/dto';
import { UserDocument } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { AccessTokenResponse, LoginDTO } from './dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly tokenService;
    constructor(userService: UsersService, jwtService: JwtService, tokenService: TokenService);
    generateAccessToken(userId: string, timestamp?: number): Promise<string>;
    verifyAccessToken(accessToken: string): Promise<boolean>;
    signUp(userDto: UserDTO, timestamp?: number): Promise<AccessTokenResponse>;
    signIn(loginDto: LoginDTO, timestamp?: number): Promise<AccessTokenResponse>;
    logout(user: UserDocument): Promise<{
        message: string;
    }>;
}
