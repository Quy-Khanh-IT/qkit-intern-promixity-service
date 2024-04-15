import { BadGatewayException, Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as sharp from 'sharp';

@Injectable()
export class UploadFileService {
  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    let fileBuffer = file.buffer;
    if (file.size > 400 * 1024) {
      fileBuffer = await this.compressImage(fileBuffer);
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          format: 'jpeg',
          folder: 'results',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  async compressImage(fileBuffer: Buffer) {
    const compressedImageBuffer = await sharp(fileBuffer)
      .jpeg({
        quality: 50,
        progressive: true,
      })
      .toBuffer();

    return compressedImageBuffer;
  }
}
