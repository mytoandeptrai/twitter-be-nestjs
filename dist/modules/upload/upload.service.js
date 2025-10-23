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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tf = __importStar(require("@tensorflow/tfjs"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const jpeg_js_1 = __importDefault(require("jpeg-js"));
const nsfw = __importStar(require("nsfwjs"));
const sharp_1 = __importDefault(require("sharp"));
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.getFileFromConfig = (key) => {
            return this.configService.get(key);
        };
        this.loadNsfwModel();
    }
    async loadNsfwModel() {
        if (!this.model) {
            this.model = await (nsfw === null || nsfw === void 0 ? void 0 : nsfw.load());
        }
    }
    getImageFormat(meta) {
        switch (meta.type) {
            case 'avatar':
                return {
                    format: 'jpeg',
                    height: 200,
                    quality: 100,
                    width: 200,
                };
            case 'background': {
                return {
                    format: 'jpeg',
                    height: 1080,
                    quality: 100,
                    width: 1920,
                };
            }
            case 'tweet':
                return {
                    format: 'jpeg',
                    height: 500,
                    quality: 100,
                    width: 500,
                };
            default:
                return {
                    format: 'jpeg',
                    height: 500,
                    quality: 100,
                    width: 500,
                };
        }
    }
    removeImageFromFilePath(filePath) {
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                return (0, utils_1.ResponseMessage)(`${this.uploadImage.name} unlink error`, 'BAD_REQUEST');
            }
        });
    }
    renameSyncFile(currentFilePath, renamedFilePath) {
        return fs_1.default.renameSync(currentFilePath, renamedFilePath);
    }
    async resizeImage({ file, format = 'jpeg', height = 1333, quality = 100, width = 2000, filePath, }) {
        try {
            await (0, sharp_1.default)(file.path)
                .resize(width, height, { fit: 'inside' })
                .toFormat(format)
                .jpeg({ quality })
                .toFile(filePath);
        }
        catch (error) {
            console.error(`${this.resizeImage.name} error`, error);
            throw error;
        }
    }
    async bulkUpload(files, cb, ...otherArgs) {
        const bulkSize = 10;
        const res = [];
        for (let i = 0; i < files.length; i += bulkSize) {
            const bulk = files.slice(i, i + bulkSize);
            const urls = await Promise.all(bulk.map((file) => cb(file, ...otherArgs)));
            res.push(...urls);
        }
        return res;
    }
    convertToTensor3D(img) {
        const image = jpeg_js_1.default.decode(img);
        const numChannels = 3;
        const numPixels = image.width * image.height;
        const values = new Int32Array(numPixels * numChannels);
        for (let i = 0; i < numPixels; i++)
            for (let c = 0; c < numChannels; ++c)
                values[i * numChannels + c] = image.data[i * 4 + c];
        return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32');
    }
    async isNsfw(filePath) {
        try {
            const img = fs_1.default.readFileSync(filePath);
            const tensor = this.convertToTensor3D(img);
            const predictions = await this.model.classify(tensor);
            return predictions.some((prediction) => {
                const { className, probability } = prediction;
                return constants_1.PORN_ClASSES.includes(className) && probability >= 0.5;
            });
        }
        catch (error) {
            console.error(`${this.isNsfw.name} error`, error);
            throw error;
        }
    }
    async uploadToCloudinary(file, format, folder = this.getFileFromConfig('CLOUDINARY_FOLDER_IMAGE')) {
        var _a;
        try {
            const response = await cloudinary_1.v2.uploader.upload(file, {
                folder,
                resource_type: format,
            });
            return (_a = response === null || response === void 0 ? void 0 : response.secure_url) !== null && _a !== void 0 ? _a : '';
        }
        catch (error) {
            console.error('Error uploading to cloudinary', error);
            return '';
        }
    }
    async uploadImage(file, imageFormat) {
        const resizedFilePath = `${file === null || file === void 0 ? void 0 : file.destination}/temp-${file === null || file === void 0 ? void 0 : file.filename}`;
        const uploadedFilePath = `${file === null || file === void 0 ? void 0 : file.destination}/${file === null || file === void 0 ? void 0 : file.filename}`;
        await this.resizeImage(Object.assign({ file, filePath: resizedFilePath }, imageFormat));
        const isNsfw = await this.isNsfw(resizedFilePath);
        if (isNsfw) {
            this.removeImageFromFilePath(resizedFilePath);
            this.removeImageFromFilePath(uploadedFilePath);
            return (0, utils_1.ResponseMessage)(`The image is sensitive content`, 'BAD_REQUEST');
        }
        this.renameSyncFile(resizedFilePath, uploadedFilePath);
        const url = await this.uploadToCloudinary(uploadedFilePath, 'image');
        if (url) {
            this.removeImageFromFilePath(uploadedFilePath);
        }
        return url;
    }
    async uploadVideo(file) {
        const cloudFolder = this.getFileFromConfig('CLOUDINARY_FOLDER_VIDEO');
        const filePath = file === null || file === void 0 ? void 0 : file.path;
        const url = await this.uploadToCloudinary(filePath, 'video', cloudFolder);
        if (url) {
            this.removeImageFromFilePath(filePath);
        }
        return url;
    }
    async uploadMedias(files, meta) {
        const imageFiles = files.filter((file) => file.mimetype.startsWith('image/'));
        const videoFiles = files.filter((file) => file.mimetype.startsWith('video/'));
        const imageFormat = this.getImageFormat(meta);
        const uploadImageFunc = this.uploadImage.bind(this);
        const uploadVideoFunc = this.uploadVideo.bind(this);
        const [imageUrls, videoUrls] = await Promise.all([
            this.bulkUpload(imageFiles, uploadImageFunc, imageFormat),
            this.bulkUpload(videoFiles, uploadVideoFunc),
        ]);
        return [...imageUrls, ...videoUrls];
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map