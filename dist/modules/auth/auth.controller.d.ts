import { AuthService } from './auth.service';
import { AccessTokenResponse, LoginDTO } from './dto';
import { UserDTO } from 'modules/users/dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(userDto: UserDTO): Promise<AccessTokenResponse>;
    signIn(loginDTO: LoginDTO): Promise<AccessTokenResponse>;
    logout(user: any): Promise<{
        message: string;
    }>;
}
