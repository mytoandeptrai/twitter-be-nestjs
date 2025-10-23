"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadTool = void 0;
const multer = __importStar(require("multer"));
const utils_1 = require("../utils");
class UploadTool {
}
exports.UploadTool = UploadTool;
UploadTool.multerFilter = (req, file, cb) => {
    cb(null, true);
};
UploadTool.imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = (0, utils_1.createUploadsFolder)('uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('.')[0];
        const fileType = file.mimetype.split('/')[1];
        const transformedName = (0, utils_1.transformNameToUrl)(fileName);
        cb(null, `${transformedName}-${Date.now()}.${fileType}`);
    },
});
UploadTool.imageUpload = {
    storage: UploadTool.imageStorage,
    fileFilter: UploadTool.multerFilter,
};
//# sourceMappingURL=upload.tool.js.map