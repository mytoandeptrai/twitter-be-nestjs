import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
export declare class UploadTool {
    static multerFilter: (req: any, file: any, cb: any) => void;
    static imageStorage: multer.StorageEngine;
    static imageUpload: MulterOptions;
}
