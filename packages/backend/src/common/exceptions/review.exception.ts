import { ERRORS_DICTIONARY, ERROR_MESSAGES, ERROR_CODES } from '../constants';
import { BaseException } from './base/base-message.exception';

// Review
export class ReviewForbiddenException extends BaseException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_FORBIDDEN;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_FORBIDDEN];

    super(errorDictionary, errorMessage, 403);
  }
}

export class ReviewNotFoundException extends BaseException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_NOT_FOUND;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_NOT_FOUND];

    super(errorDictionary, errorMessage, 404);
  }
}

export class ReviewUnauthorizeException extends BaseException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_UNAUTHORIZED;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_UNAUTHORIZED];

    super(errorDictionary, errorMessage, 401);
  }
}

export class ReviewDeleteException extends BaseException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.REVIEW_CAN_NOT_DELETE;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_CAN_NOT_DELETE];

    super(errorDictionary, errorMessage, 403);
  }
}

// Response
export class ResponseNotFoundException extends BaseException {
  constructor(message?: string) {
    const errorDictionary = ERRORS_DICTIONARY.RESPONSE_NOT_FOUND;
    const errorMessage =
      message || ERROR_MESSAGES[ERRORS_DICTIONARY.RESPONSE_NOT_FOUND];

    super(errorDictionary, errorMessage, 404);
  }
}

export class ResponseDepthExceedException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.REVIEW_DEPTH_EXCEED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_DEPTH_EXCEED],
      403,
    );
  }
}
