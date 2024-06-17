import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';

export class FileExceedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.UPLOAD_FILE_SIZE_EXCEEDED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.UPLOAD_FILE_SIZE_EXCEEDED],
      413,
    );
  }
}

export class FileTypeException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.UPLOAD_FILE_TYPE_INVALID,
      ERROR_MESSAGES[ERRORS_DICTIONARY.UPLOAD_FILE_TYPE_INVALID],
      409,
    );
  }
}
