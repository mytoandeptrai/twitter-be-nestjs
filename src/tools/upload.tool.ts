import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import path from 'path';

export class UploadTool {
  static multerFilter = (req, file, cb) => {
    cb(null, true);
  };

  static imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      /** Rút kn cần phải tạo sẵn folder uploads ở ngoài sẵn sau đó trỏ đến vị trí thì mới nhận được */
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split('.')[0];
      const fileType = file.mimetype.split('/')[1];
      cb(null, `${fileName}-${Date.now()}.${fileType}`);
    },
  });

  static imageUpload: MulterOptions = {
    storage: multer.memoryStorage(),
    fileFilter: UploadTool.multerFilter,
  };
}
