import { HttpException } from '@nestjs/common';
import { ERRORS_DICTIONARY } from 'src/common/constants';
export class BaseException extends HttpException {
  constructor(message: ERRORS_DICTIONARY, detail: string, statusCode: number) {
    super(
      {
        message,
        detail,
      },
      statusCode,
    );
  }
}
