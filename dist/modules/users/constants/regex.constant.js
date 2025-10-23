"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX_PASSWORD = exports.REGEX_EMAIL = exports.REGEX_USER = void 0;
exports.REGEX_USER = /^[A-Za-z0-9._-]{4,64}$/g;
exports.REGEX_EMAIL = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g;
exports.REGEX_PASSWORD = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
//# sourceMappingURL=regex.constant.js.map