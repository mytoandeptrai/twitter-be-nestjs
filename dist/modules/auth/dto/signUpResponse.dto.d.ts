import { User } from 'modules/users/entities';
export declare class SignUpResponseDTO {
    readonly user: User;
    readonly refreshToken: string;
}
