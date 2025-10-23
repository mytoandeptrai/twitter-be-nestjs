/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { UploadMetaInput } from './dto';
export declare class UploadService {
    private readonly configService;
    private model;
    constructor(configService: ConfigService);
    private loadNsfwModel;
    private getFileFromConfig;
    private getImageFormat;
    private removeImageFromFilePath;
    private renameSyncFile;
    private resizeImage;
    private bulkUpload;
    private convertToTensor3D;
    private isNsfw;
    private uploadToCloudinary;
    private uploadImage;
    private uploadVideo;
    uploadMedias(files: Express.Multer.File[], meta: UploadMetaInput): Promise<string[]>;
}
