import {
  Controller,
  NestInterceptor,
  Post,
  Type,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('images')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadFile(@UploadedFile() image: Express.Multer.File) {
    const result = await this.uploadFileService.uploadImageToCloudinary(image);

    return result;
  }

  @Post('uploadMutiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      limits: {
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const results = await Promise.all(
      images.map((image) =>
        this.uploadFileService.uploadImageToCloudinary(image),
      ),
    );
    return results;
  }
}
