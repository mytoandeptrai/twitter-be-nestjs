"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EAudienceConstant = exports.EGenderConstant = exports.EAudience = exports.EGender = exports.MSG = void 0;
const json_1 = require("../json");
exports.MSG = json_1.msg;
var EGender;
(function (EGender) {
    EGender[EGender["MALE"] = 0] = "MALE";
    EGender[EGender["FEMALE"] = 1] = "FEMALE";
    EGender[EGender["UNKNOWN"] = 2] = "UNKNOWN";
})(EGender = exports.EGender || (exports.EGender = {}));
var EAudience;
(function (EAudience) {
    EAudience[EAudience["PUBLIC"] = 0] = "PUBLIC";
    EAudience[EAudience["FOLLOWERS"] = 1] = "FOLLOWERS";
    EAudience[EAudience["ONLY_ME"] = 2] = "ONLY_ME";
})(EAudience = exports.EAudience || (exports.EAudience = {}));
exports.EGenderConstant = {
    MALE: 0,
    FEMALE: 1,
    UNKNOWN: 2,
};
exports.EAudienceConstant = {
    PUBLIC: 0,
    FOLLOWERS: 1,
    ONLY_ME: 2,
};
//# sourceMappingURL=message.constant.js.map