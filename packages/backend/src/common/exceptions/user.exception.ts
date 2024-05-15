import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseException } from './base/base-message.exception';

export class NewPassNotMatchOldException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_NEW_PASSWORD_NOT_MATCH_OLD,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_NEW_PASSWORD_NOT_MATCH_OLD],
      403,
    );
  }
}

export class ConfirmPassNotMatchException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_CONFIRM_PASSWORD_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_CONFIRM_PASSWORD_NOT_MATCH],
      403,
    );
  }
}
