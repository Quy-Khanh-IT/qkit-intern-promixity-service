import { HttpException } from '@nestjs/common';
import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';
export class EmailExistedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED],
      409,
    );
  }
}

export class InvalidRefreshTokenException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_INVALID_REFRESH_TOKEN,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_INVALID_REFRESH_TOKEN],
      401,
    );
  }
}

export class PhoneExistedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.USER_PHONE_EXISTED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.USER_PHONE_EXISTED],
      409,
    );
  }
}

export class UnVerifiedUser extends HttpException {
  constructor(token: string) {
    super(
      {
        message: ERRORS_DICTIONARY.USER_UNVERIFIED,
        detail: ERROR_MESSAGES[ERRORS_DICTIONARY.USER_UNVERIFIED],
        token: token,
      },
      401,
    );
  }
}

export class EmailNotExistedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED],
      404,
    );
  }
}

export class WrongCredentialsException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_WRONG_CREDENTIALS,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_WRONG_CREDENTIALS],
      401,
    );
  }
}

export class ContentNotMatchException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_CONTENT_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_CONTENT_NOT_MATCH],
      400,
    );
  }
}

export class UnauthorizedException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_UNAUTHORIZED_EXCEPTION,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_UNAUTHORIZED_EXCEPTION],
      401,
    );
  }
}

export class TokenExpiredException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_TOKEN_EXPIRED,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_TOKEN_EXPIRED],
      401,
    );
  }
}

export class InvalidTokenException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_INVALID_TOKEN,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_INVALID_TOKEN],
      401,
    );
  }
}

export class PasswordNotMatchException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH],
      401,
    );
  }
}

export class TokenResetExceededLimitException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_TOKEN_RESET_EXEEDED_LIMIT,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_TOKEN_RESET_EXEEDED_LIMIT],
      429,
    );
  }
}

export class OTPNotMatchException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.AUTH_OTP_NOT_MATCH,
      ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_OTP_NOT_MATCH],
      409,
    );
  }
}
