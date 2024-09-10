import { ERRORS_DICTIONARY, ERROR_MESSAGES } from '../constants';
import { BaseBusinessException } from './base/base-message.exception';

export class OTPExceedLimitException extends BaseBusinessException {
  constructor() {
    super(
      ERRORS_DICTIONARY.OTP_EXCEEDED_LIMIT,
      ERROR_MESSAGES[ERRORS_DICTIONARY.OTP_EXCEEDED_LIMIT],
      429,
    );
  }
}
