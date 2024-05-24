import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import * as Dayjs from 'dayjs';
import * as OTPGenerator from 'otp-generator';
import {
  ERRORS_DICTIONARY,
  ERROR_MESSAGES,
  OTPConstant,
} from 'src/common/constants';
import { EmailNotExistedException } from 'src/common/exceptions';
import { OTPExceedLimitException } from 'src/common/exceptions/otp.exception';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { OTP } from './entities/otp.entity';
import { OtpRepository } from './repository/otp.repository';
@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: OtpRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private mailService: MailService,
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

  async createForUpdatingEmail(email: string): Promise<void> {
    const isExistingEmail = await this.userService.checkEmailExist(email);
    if (!isExistingEmail) {
      throw new EmailNotExistedException();
    }
    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_UPDATE_EMAIL) {
      throw new OTPExceedLimitException();
    }
    const TTL = 4 * 60; // 4 minutes

    const result = await this.create(email, TTL);
    if (!result) {
      throw new InternalServerErrorException();
    }
    this.mailService.sendOTPMail(
      email,
      'OTP Code for updateing email',
      result.otp,
    );
  }

  async createForRegister(email: string): Promise<OTP> {
    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_REGISTRATION) {
      throw new OTPExceedLimitException();
    }

    const TTL = 3 * 60; // 3 minutes
    return await this.create(email, TTL);
  }

  async createForUpdateEmail(email: string): Promise<OTP> {
    const isExistingEmail = await this.userService.checkEmailExist(email);
    if (!isExistingEmail) {
      throw new EmailNotExistedException();
    }

    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_UPDATE_EMAIL) {
      throw new OTPExceedLimitException();
    }

    const TTL = 4 * 60; // 4 minutes
    return await this.create(email, TTL);
  }

  async createForResetpassword(email: string): Promise<OTP> {
    const isExistingEmail = await this.userService.checkEmailExist(email);
    if (!isExistingEmail) {
      throw new EmailNotExistedException();
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

    const TTL = 4 * 60; // 4 minutes
    return await this.create(email, TTL);
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
