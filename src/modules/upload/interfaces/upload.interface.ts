import { FormatEnum } from 'sharp';

interface IImageFormat {
  width?: number;
  height?: number;
  quality?: number;
  format?: keyof FormatEnum;
}

interface IResizeImageInput extends IImageFormat {
  file: Express.Multer.File;
  filePath: string;
}

export { IImageFormat, IResizeImageInput };
