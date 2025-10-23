"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
class UpdateUserDTO extends (0, swagger_1.PartialType)(user_dto_1.UserDTO) {
}
exports.UpdateUserDTO = UpdateUserDTO;
//# sourceMappingURL=updateUser.dto.js.map