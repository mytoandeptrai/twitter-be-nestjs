import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tf from '@tensorflow/tfjs';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import jpeg from 'jpeg-js';
import * as nsfw from 'nsfwjs';
import sharp from 'sharp';
import { ResponseMessage } from 'utils';
import { PORN_ClASSES } from './constants';
import { UploadMetaInput } from './dto';
import { IImageFormat, IResizeImageInput } from './interfaces';

@Injectable()
export class UploadService {
  private model: nsfw.NSFWJS;

  constructor(private readonly configService: ConfigService) {
    this.loadNsfwModel();
  }

  private async loadNsfwModel(): Promise<void> {
    if (!this.model) {
      this.model = await nsfw?.load();
    }
  }

  private getFileFromConfig = (key: string) => {
    return this.configService.get<string>(key);
  };

  private getImageFormat(meta: UploadMetaInput): IImageFormat {
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

  private removeImageFromFilePath(filePath: string) {
    fs.unlink(filePath, (err) => {
      if (err) {
        return ResponseMessage(
          `${this.uploadImage.name} unlink error`,
          'BAD_REQUEST',
        );
      }
    });
  }

  private renameSyncFile(currentFilePath: string, renamedFilePath: string) {
    return fs.renameSync(currentFilePath, renamedFilePath);
  }

  private async resizeImage({
    file,
    format = 'jpeg',
    height = 1333,
    quality = 100,
    width = 2000,
    filePath,
  }: IResizeImageInput): Promise<void> {
    try {
      await sharp(file.path)
        .resize(width, height, { fit: 'inside' })
        .toFormat(format)
        .jpeg({ quality })
        .toFile(filePath);
    } catch (error) {
      console.error(`${this.resizeImage.name} error`, error);
      throw error;
    }
  }

  private async bulkUpload(
    files: Express.Multer.File[],
    cb: any,
    ...otherArgs: any[]
  ): Promise<string[]> {
    const bulkSize = 10;
    const res: string[] = [];
    for (let i = 0; i < files.length; i += bulkSize) {
      const bulk = files.slice(i, i + bulkSize);
      const urls = await Promise.all(
        bulk.map((file) => cb(file, ...otherArgs)),
      );
      res.push(...urls);
    }

    return res;
  }

  private convertToTensor3D(img: jpeg.BufferLike): tf.Tensor3D {
    const image = jpeg.decode(img);
    /** number of color in RBG ( Red, Black, Green ) */
    const numChannels = 3;
    /** total pixels in picture */
    const numPixels = image.width * image.height;
    /** an array for containing pixel after convert into number */
    const values = new Int32Array(numPixels * numChannels);
    /** convert array from [0,0,0,0,...,0] -> [5, 3, 10, 5, 3, 10, ....] ( 5 is assign at the first variable in image.data - buffer type ) using Int32*/
    for (let i = 0; i < numPixels; i++)
      for (let c = 0; c < numChannels; ++c)
        values[i * numChannels + c] = image.data[i * 4 + c];

    return tf.tensor3d(
      values,
      [image.height, image.width, numChannels],
      'int32',
    );
  }

  private async isNsfw(filePath: string): Promise<boolean> {
    try {
      const img = fs.readFileSync(filePath);
      const tensor = this.convertToTensor3D(img);
      const predictions = await this.model.classify(tensor);
      return predictions.some((prediction) => {
        const { className, probability } = prediction;
        return PORN_ClASSES.includes(className) && probability >= 0.5;
      });
    } catch (error) {
      console.error(`${this.isNsfw.name} error`, error);
      throw error;
    }
  }

  private async uploadToCloudinary(
    file: string,
    format: 'image' | 'video' | 'raw' | 'auto',
    folder = this.getFileFromConfig('CLOUDINARY_FOLDER_IMAGE'),
  ): Promise<string> {
    try {
      const response = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: format,
      });

      return response?.secure_url ?? '';
    } catch (error) {
      console.error('Error uploading to cloudinary', error);
      return '';
    }
  }

  private async uploadImage(
    file: Express.Multer.File,
    imageFormat: IImageFormat,
  ): Promise<string> {
    const resizedFilePath = `${file?.destination}/temp-${file?.filename}`;
    const uploadedFilePath = `${file?.destination}/${file?.filename}`;

    await this.resizeImage({
      file,
      filePath: resizedFilePath,
      ...imageFormat,
    });
    const isNsfw = await this.isNsfw(resizedFilePath);
    if (isNsfw) {
      this.removeImageFromFilePath(resizedFilePath);
      this.removeImageFromFilePath(uploadedFilePath);
      return ResponseMessage(`The image is sensitive content`, 'BAD_REQUEST');
    }
    this.renameSyncFile(resizedFilePath, uploadedFilePath);
    const url = await this.uploadToCloudinary(uploadedFilePath, 'image');
    if (url) {
      this.removeImageFromFilePath(uploadedFilePath);
    }
    return url;
  }

  private async uploadVideo(file: Express.Multer.File): Promise<string> {
    const cloudFolder = this.getFileFromConfig('CLOUDINARY_FOLDER_VIDEO');
    const filePath = file?.path;
    const url = await this.uploadToCloudinary(filePath, 'video', cloudFolder);
    if (url) {
      this.removeImageFromFilePath(filePath);
    }
    return url;
  }

  async uploadMedias(
    files: Express.Multer.File[],
    meta: UploadMetaInput,
  ): Promise<string[]> {
    const imageFiles = files.filter((file) =>
      file.mimetype.startsWith('image/'),
    );
    const videoFiles = files.filter((file) =>
      file.mimetype.startsWith('video/'),
    );

    const imageFormat = this.getImageFormat(meta);
    const uploadImageFunc = this.uploadImage.bind(this);
    const uploadVideoFunc = this.uploadVideo.bind(this);
    const [imageUrls, videoUrls] = await Promise.all([
      this.bulkUpload(imageFiles, uploadImageFunc, imageFormat),
      this.bulkUpload(videoFiles, uploadVideoFunc),
    ]);

    return [...imageUrls, ...videoUrls];
  }
}
