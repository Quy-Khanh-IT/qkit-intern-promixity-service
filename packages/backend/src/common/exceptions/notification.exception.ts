import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';

export class NotificationNotFoundException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.NOTIFICATION_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.NOTIFICATION_NOT_FOUND],
      404,
    );
  }
}

export class NotificationNotBelongException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.NOTIFICATION_NOT_BELONG,
      ERROR_MESSAGES[ERRORS_DICTIONARY.NOTIFICATION_NOT_BELONG],
      403,
    );
  }
}
