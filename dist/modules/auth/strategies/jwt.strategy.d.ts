import { TokenService } from 'modules/token/token.service';
import { User } from 'modules/users/entities';
import { UsersService } from 'modules/users/users.service';
import { Strategy } from 'passport-jwt';
import { PayloadDTO } from '../dto';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    private readonly tokenService;
    constructor(userService: UsersService, tokenService: TokenService);
    validate(payload: PayloadDTO): Promise<User>;
}
export {};
