"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryGetPipe = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const tools_1 = require("../../tools");
let QueryGetPipe = class QueryGetPipe {
    constructor() {
        this.defaultSortOrder = (field) => ['updatedAt', 'createdAt', '_id'].includes(field) ? -1 : 1;
    }
    transform(value) {
        const isDefault = !value.custom || value.custom === '0';
        const select = ((selectValue) => {
            const res = {};
            if (selectValue) {
                selectValue.split(' ').forEach((field) => {
                    if (field.charAt(0) === '-') {
                        res[field.slice(1)] = 0;
                    }
                    else {
                        res[field] = 1;
                    }
                });
            }
            return res;
        })(value.select);
        const fields = ((sort) => {
            if (!sort) {
                return isDefault ? ['updatedAt'] : [];
            }
            return sort.split(' ');
        })(value.sort);
        const orders = ((orderString, fieldArray) => {
            const res = orderString
                ? orderString.split(' ').map((ord) => (ord === '-1' ? -1 : 1))
                : [];
            for (let i = res.length; i < fieldArray.length; ++i) {
                res.push(this.defaultSortOrder(fieldArray[i]));
            }
            return res;
        })(value.order, fields);
        const sortOption = {};
        for (const [i, field] of fields.entries()) {
            sortOption[field] = orders[i];
        }
        sortOption.updatedAt = sortOption.updatedAt || -1;
        const conditions = (value.cond && JSON.parse(value.cond)) || {};
        const page = Number(value.page) * 1 || constants_1.CURRENT_PAGE_DEFAULT;
        const limit = Number(value.limit) * 1 || constants_1.PAGE_SIZE_DEFAULT;
        const skip = page && (page - 1) * limit;
        const result = {
            conditions,
            options: {
                select,
                sort: sortOption,
                skip,
                limit,
            },
        };
        return result;
    }
};
QueryGetPipe = __decorate([
    (0, common_1.Injectable)()
], QueryGetPipe);
exports.QueryGetPipe = QueryGetPipe;
//# sourceMappingURL=query-get.pipe.js.map