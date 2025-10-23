/// <reference types="multer" />
import { UploadMetaInput } from './dto';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadMedias(files: Express.Multer.File[], meta: UploadMetaInput): Promise<string[]>;
    uploadMedia(image: Express.Multer.File, meta: UploadMetaInput): Promise<string[]>;
}
