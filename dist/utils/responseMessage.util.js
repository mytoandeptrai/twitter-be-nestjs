"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = void 0;
const common_1 = require("@nestjs/common");
const ResponseMessage = (error, status) => {
    throw new common_1.HttpException({
        error,
    }, common_1.HttpStatus[status]);
};
exports.ResponseMessage = ResponseMessage;
//# sourceMappingURL=responseMessage.util.js.map