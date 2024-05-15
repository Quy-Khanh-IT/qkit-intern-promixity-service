import { Injectable } from '@nestjs/common';
import * as Dayjs from 'dayjs';
import * as OTPGenerator from 'otp-generator';
import { OTPConstant } from 'src/common/constants';
import {
  EmailExistedException,
  EmailNotExistedException,
} from 'src/common/exceptions';
import { OTPExceedLimitException } from 'src/common/exceptions/otp.exception';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { UserService } from '../user/user.service';
import { OTP } from './entities/otp.entity';
import { OtpRepository } from './repository/otp.repository';
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
      throw new EmailExistedException();
    }

    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_REGISTRATION) {
      throw new OTPExceedLimitException();
    }
    return await this.create(email, 4 * 60);
  }

  async createForResetpassword(email: string): Promise<OTP> {
    const isExistingEmail = await this.userService.checkEmailExist(email);
    if (!isExistingEmail) {
      throw new EmailNotExistedException();
    }

    const otpCodeCount = await this.otpRepo.findAll({ email });
    if (otpCodeCount.count >= OTPConstant.OTP_MAX_REGISTRATION) {
      throw new OTPExceedLimitException();
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
