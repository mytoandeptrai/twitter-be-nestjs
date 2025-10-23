import { UserDTO } from './user.dto';
declare const RegisterUserDTO_base: import("@nestjs/common").Type<Partial<Pick<UserDTO, "name" | "username" | "password" | "passwordConfirm">>>;
export declare class RegisterUserDTO extends RegisterUserDTO_base {
}
export {};
