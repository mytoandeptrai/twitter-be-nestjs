"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCommonErrors = exports.QueryGet = exports.ApiQueryGetManyNoCond = exports.ApiQueryGetMany = exports.ApiQuerySort = exports.ApiQueryPagination = exports.ApiQueryCond = exports.ApiPropertyFile = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pipes_1 = require("../pipes");
const ApiPropertyFile = () => {
    return (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        required: false,
    });
};
exports.ApiPropertyFile = ApiPropertyFile;
const ApiQueryCond = () => {
    return (0, swagger_1.ApiQuery)({
        name: 'cond',
        required: false,
        description: 'Điều kiện tìm kiếm theo MongoDB',
    });
};
exports.ApiQueryCond = ApiQueryCond;
const ApiQueryPagination = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        examples: {
            Empty: {},
            Default: { value: 1 },
        },
    }), (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        examples: {
            Empty: {},
            Default: { value: 20 },
        },
    }));
};
exports.ApiQueryPagination = ApiQueryPagination;
const ApiQuerySort = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        examples: {
            Empty: {},
            'Example 1': { value: '_id createdAt updatedAt' },
            Default: { value: 'updatedAt' },
        },
    }), (0, swagger_1.ApiQuery)({
        name: 'order',
        required: false,
        examples: {
            Empty: {},
            'Example 1': { value: '-1 1 -1' },
            Default: { value: '-1' },
        },
    }));
};
exports.ApiQuerySort = ApiQuerySort;
const ApiQueryGetMany = () => (0, common_1.applyDecorators)((0, exports.ApiQuerySort)(), (0, exports.ApiQueryPagination)());
exports.ApiQueryGetMany = ApiQueryGetMany;
const ApiQueryGetManyNoCond = () => (0, common_1.applyDecorators)((0, exports.ApiQuerySort)(), (0, exports.ApiQueryPagination)());
exports.ApiQueryGetManyNoCond = ApiQueryGetManyNoCond;
const QueryGet = () => {
    return (0, common_1.Query)(pipes_1.QueryGetPipe);
};
exports.QueryGet = QueryGet;
const ApiCommonErrors = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({
        description: `Thông tin xác thực không chính xác (thông tin đăng nhập hoặc JWT). <a href=/error-example/unauthorized target=_blank style="text-decoration:none"> Ví dụ</a>`,
    }), (0, swagger_1.ApiForbiddenResponse)({
        description: `Người dùng không được cấp quyền truy cập nguồn nội dung. <a href=/error-example/forbidden target=_blank style="text-decoration:none"> Ví dụ</a>`,
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: `Lỗi hệ thống. <a href=/error-example/internal-server-error target=_blank style="text-decoration:none"> Ví dụ</a>`,
    }));
};
exports.ApiCommonErrors = ApiCommonErrors;
//# sourceMappingURL=common.decorator.js.map