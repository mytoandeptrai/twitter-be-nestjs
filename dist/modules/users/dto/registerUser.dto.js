"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
class RegisterUserDTO extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(user_dto_1.UserDTO, ['name', 'username', 'password', 'passwordConfirm'])) {
}
exports.RegisterUserDTO = RegisterUserDTO;
//# sourceMappingURL=registerUser.dto.js.map