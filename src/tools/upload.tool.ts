import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import { createUploadsFolder, transformNameToUrl } from 'utils';

export class UploadTool {
  static multerFilter = (req, file, cb) => {
    cb(null, true);
  };

  static imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = createUploadsFolder('uploads');
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split('.')[0];
      const fileType = file.mimetype.split('/')[1];
      const transformedName = transformNameToUrl(fileName);
      cb(null, `${transformedName}-${Date.now()}.${fileType}`);
    },
  });

  static imageUpload: MulterOptions = {
    storage: UploadTool.imageStorage,
    fileFilter: UploadTool.multerFilter,
  };
}
