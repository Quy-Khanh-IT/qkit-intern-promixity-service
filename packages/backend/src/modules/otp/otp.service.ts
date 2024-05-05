import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { OtpRepository } from './repository/otp.repository';
import * as OTPGenerator from 'otp-generator';
import {
  OTPConstant,
  ERRORS_DICTIONARY,
  ERROR_MESSAGES,
} from 'src/common/constants';
import * as Dayjs from 'dayjs';
import { OTP } from './entities/otp.entity';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: OtpRepository,

    private readonly userService: UserService,
  ) {}
  private async create(email: string, TTLSecond: number): Promise<OTP> {
    const otpCode = OTPGenerator.generate(OTPConstant.OTP_LENGTH, {
      upperCase: OTPConstant.OTP_UPPERCASE,
      specialChars: OTPConstant.OTP_SPECIAL_CHAR,
      alphabets: OTPConstant.OTP_ALPHABET,
    });

    const expiredTime = Dayjs().add(TTLSecond, 'seconds').valueOf();

    const result = await this.otpRepo.create({
      email: email,
      otp: otpCode,
      expiredAt: expiredTime,
    });

    return result;
  }

  async createForRegister(email: string): Promise<OTP> {
    const isExistingEmail = await this.userService.checkEmailExist(email);
    if (isExistingEmail) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED],
        },
        409,
      );
    }

    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_REGISTRATION) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.OTP_EXCEEDED_LIMIT,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.OTP_EXCEEDED_LIMIT],
        },
        429,
      );
    }
    return await this.create(email, 4 * 60);
  }

  async createForResetpassword(email: string): Promise<OTP> {
    const isExistingEmail = await this.userService.checkEmailExist(email);
    if (!isExistingEmail) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED],
        },
        404,
      );
    }

    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_REGISTRATION) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.OTP_EXCEEDED_LIMIT,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.OTP_EXCEEDED_LIMIT],
        },
        429,
      );
    }
    return await this.create(email, 4 * 60);
  }

  async findManyByEmail(
    email: string,
    limit: number,
    ascending: boolean = false,
  ): Promise<FindAllResponse<OTP>> {
    return await this.otpRepo.findAll(
      { email },
      { limit: limit, sort: { expiredAt: ascending ? 1 : -1 } },
    );
  }
}
