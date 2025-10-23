"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.TIME_TO_LIVE_CACHE = exports.NUMBER_OF_MAXIMUM_CACHE_SIZE = exports.NUMBER_OF_MAXIMUM_CACHE = void 0;
exports.NUMBER_OF_MAXIMUM_CACHE = 500;
exports.NUMBER_OF_MAXIMUM_CACHE_SIZE = 5000;
exports.TIME_TO_LIVE_CACHE = 1000 * 60 * 5;
exports.options = {
    max: exports.NUMBER_OF_MAXIMUM_CACHE,
    maxSize: exports.NUMBER_OF_MAXIMUM_CACHE_SIZE,
    sizeCalculation: (value, key) => {
        return 1;
    },
    ttl: exports.TIME_TO_LIVE_CACHE,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
};
//# sourceMappingURL=link-preview.constant.js.map