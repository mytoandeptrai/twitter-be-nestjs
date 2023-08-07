import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';

export class UploadTool {
  static multerFilter = (req, file, cb) => {
    console.log(`file.mimetype`, file.mimetype);
    cb(null, true);
  };

  static imageUpload: MulterOptions = {
    storage: multer.memoryStorage(),
    fileFilter: UploadTool.multerFilter,
  };
}
