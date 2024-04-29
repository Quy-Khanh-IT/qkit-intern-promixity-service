import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as sharp from 'sharp';
import { ConfigKey, UploadFileConstraint } from 'src/common/constants';

@Injectable()
export class UploadFileService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    let fileBuffer = file.buffer;
    if (file.size > UploadFileConstraint.MAX_FILE_SIZE) {
      fileBuffer = await this.compressImage(fileBuffer);
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          format: UploadFileConstraint.IMAGE_FORMAT,
          folder: this.configService.get<string>(
            ConfigKey.CLOUDINARY_IMAGE_FOLDER,
          ),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  async compressImage(fileBuffer: Buffer): Promise<Buffer> {
    const compressedImageBuffer = await sharp(fileBuffer)
      .jpeg({
        quality: UploadFileConstraint.QUALITY_COMPRESSED_IMAGE,
        progressive: true,
      })
      .toBuffer();

    return compressedImageBuffer;
  }
}
