import { ERRORS_DICTIONARY, ERROR_MESSAGES, ERROR_CODES } from '../constants';
import { BaseException } from './base/base-message.exception';

export class BusinessNotFoundException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
    );
  }
}
