import { ERRORS_DICTIONARY, ERROR_MESSAGES, ERROR_CODES } from '../constants';
import { BaseException } from './base/base-message.exception';

export class BusinessNotFoundException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      404,
    );
  }
}

export class BusinessStatusException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_INVALID_STATUS_ACTION,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_INVALID_STATUS_ACTION],
      403,
    );
  }
}

export class BusinessInvalidException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_FORBIDDEN,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_FORBIDDEN],
      403,
    );
  }
}
