import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';

// Review
export class ReviewForbiddenException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_FORBIDDEN;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_FORBIDDEN];

    super(errorDictionary, errorMessage, 403);
  }
}

export class ReviewNotFoundException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_NOT_FOUND;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_NOT_FOUND];

    super(errorDictionary, errorMessage, 404);
  }
}

export class ReviewUnauthorizeException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_UNAUTHORIZED;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_UNAUTHORIZED];

    super(errorDictionary, errorMessage, 401);
  }
}

export class ReviewDeleteException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_CAN_NOT_DELETE;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_CAN_NOT_DELETE];

    super(errorDictionary, errorMessage, 403);
  }
}

// Response
export class ResponseNotFoundException extends BaseBusinessException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.RESPONSE_NOT_FOUND;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.RESPONSE_NOT_FOUND];

    super(errorDictionary, errorMessage, 404);
  }
}

export class ResponseDepthExceedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.REVIEW_DEPTH_EXCEED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_DEPTH_EXCEED],
      403,
    );
  }
}
