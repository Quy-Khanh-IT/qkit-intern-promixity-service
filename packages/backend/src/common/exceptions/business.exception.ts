import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';

export class BusinessNotFoundException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      404,
    );
  }
}

export class BusinessUnauthorizedException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.BUSINESS_UNAUTHORIZED;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_UNAUTHORIZED];

    super(errorDictionary, errorMessage, 401);
  }
}

export class BusinessStatusException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.BUSINESS_INVALID_STATUS_ACTION;
    const errorMessage =
      message ||
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_INVALID_STATUS_ACTION];

    super(errorDictionary, errorMessage, 403);
  }
}

export class BusinessInvalidException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_FORBIDDEN,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_FORBIDDEN],
      403,
    );
  }
}

export class BusinessInvalidAddressException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_INVALID_ADDRESS,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_INVALID_ADDRESS],
      403,
    );
  }
}

export class BusinessNotBelongException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.BUSINESS_NOT_BELONG,
      ERROR_MESSAGES[ERRORS_DICTIONARY.BUSINESS_NOT_BELONG],
      403,
    );
  }
}
