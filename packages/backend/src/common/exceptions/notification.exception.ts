import { ERRORS_DICTIONARY, ERROR_MESSAGES, ERROR_CODES } from '../constants';
import { BaseException } from './base/base-message.exception';

export class NotificationNotFoundException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.NOTIFICATION_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.NOTIFICATION_NOT_FOUND],
      404,
    );
  }
}

export class NotificationNotBelongException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.NOTIFICATION_NOT_BELONG,
      ERROR_MESSAGES[ERRORS_DICTIONARY.NOTIFICATION_NOT_BELONG],
      403,
    );
  }
}
