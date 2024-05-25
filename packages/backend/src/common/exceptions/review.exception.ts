import { ERRORS_DICTIONARY, ERROR_MESSAGES, ERROR_CODES } from '../constants';
import { BaseException } from './base/base-message.exception';

export class ReviewNotFoundException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.REVIEW_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_NOT_FOUND],
      404,
    );
  }
}

export class ReplyDepthExceedException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.REVIEW_DEPTH_EXCEED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.REVIEW_DEPTH_EXCEED],
      403,
    );
  }
}
