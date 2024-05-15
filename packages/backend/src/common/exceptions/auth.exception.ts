import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseException } from './base/base-message.exception';

export class EmailExistedException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED],
      400,
    );
  }
}

export class EmailNotExistedException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED],
      400,
    );
  }
}

export class WrongCredentialsException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_WRONG_CREDENTIALS,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_WRONG_CREDENTIALS],
      401,
    );
  }
}

export class ContentNotMatchException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_CONTENT_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_CONTENT_NOT_MATCH],
      400,
    );
  }
}

export class UnauthorizedException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_UNAUTHORIZED_EXCEPTION,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_UNAUTHORIZED_EXCEPTION],
      401,
    );
  }
}

export class TokenExpiredException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_TOKEN_EXPIRED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_TOKEN_EXPIRED],
      401,
    );
  }
}

export class InvalidTokenException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_INVALID_TOKEN,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_INVALID_TOKEN],
      401,
    );
  }
}

export class PasswordNotMatchException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH],
      401,
    );
  }
}

export class TokenResetExceededLimitException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_TOKEN_RESET_EXEEDED_LIMIT,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_TOKEN_RESET_EXEEDED_LIMIT],
      400,
    );
  }
}

export class OTPNotMatchException extends BaseException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_OTP_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_OTP_NOT_MATCH],
      400,
    );
  }
}
