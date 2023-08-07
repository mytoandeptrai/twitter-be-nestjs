import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import jpeg from 'jpeg-js';
import * as tf from '@tensorflow/tfjs';
import * as nsfw from 'nsfwjs';
import sharp, { FormatEnum } from 'sharp';
import { generateUUID } from 'utils';
import { UploadMetaInput } from './dto';
import { IImageFormat, IResizeImageInput } from './interfaces';
import { PORN_ClASSES } from './constants';

@Injectable()
export class UploadService {
  private model: nsfw.NSFWJS;
  private imagePath = '';

  constructor(private readonly configService: ConfigService) {
    this.loadNsfwModel();
    const imagePath = this.configService.get<string>('imagePath');
    if (imagePath) {
      this.imagePath = imagePath;
    }
  }

  private async loadNsfwModel(): Promise<void> {
    if (!this.model) {
      this.model = await nsfw?.load();
    }
  }

  private getFilePath(
    type: 'video' | 'image',
    format: keyof FormatEnum = 'jpeg',
  ): string {
    return `${this.imagePath}/${
      type === 'video' ? `${generateUUID()}.mp4` : `${generateUUID()}.${format}`
    }`;
  }

  private getFileType = (file: Express.Multer.File) => {
    return file.originalname?.split('.')[1];
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

  private async resizeImage({
    file,
    format = 'jpeg',
    height = 1333,
    quality = 100,
    width = 2000,
    filePath,
  }: IResizeImageInput): Promise<void> {
    try {
      await sharp(file.buffer)
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
    const numChannels = 3;
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);
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
}
