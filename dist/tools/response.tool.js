"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTool = void 0;
const common_1 = require("../common");
const constants_1 = require("../constants");
class ResponseTool {
    static RESPONSE(data, total) {
        return {
            data,
            total,
        };
    }
    static GET_OK(data, total, message = constants_1.MSG.RESPONSE.GET_REQUEST_OK) {
        return {
            data,
            total,
            message,
            statusCode: 200,
        };
    }
    static POST_OK(data, total, message = constants_1.MSG.RESPONSE.POST_REQUEST_OK) {
        return {
            data,
            total,
            message,
            statusCode: 200,
        };
    }
    static CREATED(data, message = constants_1.MSG.RESPONSE.CREATED) {
        return {
            data,
            message,
            statusCode: 201,
        };
    }
    static PUT_OK(data, message = constants_1.MSG.RESPONSE.PUT_REQUEST_OK) {
        return {
            data,
            message,
            statusCode: 200,
        };
    }
    static DELETE_OK(data, message = constants_1.MSG.RESPONSE.DELETE_REQUEST_OK) {
        return {
            data,
            message,
            statusCode: 200,
        };
    }
    static PATCH_OK(data, message = constants_1.MSG.RESPONSE.PATCH_REQUEST_OK) {
        return {
            data,
            message,
            statusCode: 200,
        };
    }
    static ERROR(error, statusCode, message) {
        return {
            error,
            message,
            statusCode,
        };
    }
    static BAD_REQUEST(message, error) {
        return {
            error,
            message,
            statusCode: 400,
        };
    }
    static UNAUTHORIZED(message, error) {
        return {
            error,
            message,
            statusCode: 401,
        };
    }
    static NOT_FOUND(message, error) {
        return {
            error,
            message,
            statusCode: 404,
        };
    }
    static CONFLICT(message, error) {
        return {
            error,
            message,
            statusCode: 409,
        };
    }
}
exports.ResponseTool = ResponseTool;
//# sourceMappingURL=response.tool.js.map