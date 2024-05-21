import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileTypeException } from '../exceptions/file.exception';
export class UploadFileConstraint {
  static LIMIT_FILE_SIZE = 400 * 1024;
  static QUALITY_COMPRESSED_IMAGE = 50;
  static IMAGE_STANDARD_FORMAT = 'jpeg';
  static MAX_UPLOAD_FILE_SIZE = 1024 * 1024;
  static ACCEPTED_FILE_MIMETYPE: string[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];
  static MULTER_OPTION: MulterOptions = {
    limits: {
      fileSize: this.MAX_UPLOAD_FILE_SIZE,
    },
    fileFilter: (req, file, callback) => {
      if (!this.ACCEPTED_FILE_MIMETYPE.includes(file.mimetype)) {
        callback(new FileTypeException(), false);
      }
      callback(null, true);
    },
  };
}

// Path: packages/backend/src/common/constraints/upload-file.constraint.ts
