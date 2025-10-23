"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicateObjectInArray = exports.isValidUrl = exports.parseJson = exports.createUploadsFolder = exports.transformNameToUrl = exports.generateUUID = void 0;
const path_1 = __importDefault(require("path"));
const generateUUID = () => {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' &&
        typeof performance.now === 'function') {
        d += performance.now();
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
};
exports.generateUUID = generateUUID;
const transformNameToUrl = (str) => {
    return `${str.toLowerCase().split(' ').join('-')}-${Date.now()}`;
};
exports.transformNameToUrl = transformNameToUrl;
const createUploadsFolder = (folderName) => {
    return path_1.default.join(process.cwd(), folderName);
};
exports.createUploadsFolder = createUploadsFolder;
const parseJson = (data) => {
    try {
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error parsing json', error);
    }
    return null;
};
exports.parseJson = parseJson;
const isValidUrl = (url) => {
    try {
        new URL(url);
    }
    catch (error) {
        return false;
    }
    return true;
};
exports.isValidUrl = isValidUrl;
const removeDuplicateObjectInArray = (list) => list.filter((item, index) => {
    const _item = JSON.stringify(item);
    return (index ===
        list.findIndex((obj) => {
            return JSON.stringify(obj) === _item;
        }));
});
exports.removeDuplicateObjectInArray = removeDuplicateObjectInArray;
//# sourceMappingURL=helper.js.map