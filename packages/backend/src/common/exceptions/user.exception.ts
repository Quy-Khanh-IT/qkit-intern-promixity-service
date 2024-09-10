import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';

export class NewPassNotMatchOldException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_PASSWORD_NOT_MATCH_OLD,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_PASSWORD_NOT_MATCH_OLD],
      403,
    );
  }
}

export class ExceedResetEmailRequestException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_EXCEED_RESET_EMAIL_REQUEST,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_EXCEED_RESET_EMAIL_REQUEST],
      403,
    );
  }
}

export class ConfirmPassNotMatchException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_CONFIRM_PASSWORD_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_CONFIRM_PASSWORD_NOT_MATCH],
      403,
    );
  }
}

export class UserNotAcceptRoleException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_NOT_ACCEPTED_ROLE,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_NOT_ACCEPTED_ROLE],
      403,
    );
  }
}

export class UserConflictAdminException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_CONFLICT_ADMIN,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_CONFLICT_ADMIN],
      409,
    );
  }
}

export class UserNotFoundException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_NOT_FOUND,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_NOT_FOUND],
      404,
    );
  }
}

export class UserUnVerifiedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_UNVERIFIED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_NOT_FOUND],
      404,
    );
  }
}

export class UserAlreadyExistException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_ALREADY_EXIST,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_ALREADY_EXIST],
      400,
    );
  }
}

export class UserDisabledException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_DISABLED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_DISABLED],
      403,
    );
  }
}
