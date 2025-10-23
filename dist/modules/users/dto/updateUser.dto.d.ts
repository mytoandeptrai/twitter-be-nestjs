import { UserDTO } from './user.dto';
declare const UpdateUserDTO_base: import("@nestjs/common").Type<Partial<UserDTO>>;
export declare class UpdateUserDTO extends UpdateUserDTO_base {
    oldPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}
export {};
