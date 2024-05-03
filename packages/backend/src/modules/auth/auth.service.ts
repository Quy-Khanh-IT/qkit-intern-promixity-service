import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ERRORS_DICTIONARY, ERROR_MESSAGES } from 'src/common/constants';
import { User } from '../user/entities/user.entity';
import {
  LoginDto,
  LoginResponeDto,
  ResetPasswordDto,
  requestResetPasswordDto,
} from './dto/index';
import { verifyHash } from 'src/common/utils';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  public async signUp(registrationData: SignUpDto): Promise<User> {
    const isExistingEmail = await this.userService.checkEmailExist(
      registrationData.email,
    );

    if (isExistingEmail) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_EMAIL_EXISTED,
          detail: 'Email already exists',
        },
        409,
      );
    }

    const otps = await this.otpService.findManyByEmail(
      registrationData.email,
      5,
    );

    if (!otps.count || otps.items[0].otp !== registrationData.otp) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.OTP_NOT_MATCH,
          detail: 'Invalid OTP',
        },
        400,
      );
    }

    const hashedPassword: string = await argon2.hash(registrationData.password);

    return await this.userService.create({
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email,
      password: hashedPassword,
      address: {
        city: registrationData.city,
        country: registrationData.country,
        province: registrationData.province,
      },
      phoneNumber: registrationData.phoneNumber,
      roles: ['user'],
      image: null,
    });
  }

  public async login(loginData: LoginDto): Promise<LoginResponeDto> {
    const user = await this.userService.findOneByEmail(loginData.email);
    if (!user) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
        detail: 'User not found',
      });
    }
    const isMatchingPassword = await verifyHash(
      user.password,
      loginData.password,
    );
    if (!isMatchingPassword) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_WRONG_CREDENTIALS,
          detail: 'Incorrect username or password',
        },
        401,
      );
    }
    const pairToken = await this.tokenService.genNewPairToken({
      user_id: user._id.toString(),
      action: 'login',
    });
    return {
      accessToken: pairToken[0],
      refreshToken: pairToken[1],
    };
  }

  public async resetPassword(
    data: ResetPasswordDto,
    email: string,
  ): Promise<void> {
    if (data.newPassword !== data.oldPassword) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH],
        },
        403,
      );
    }
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.USER_NOT_FOUND],
        },
        404,
      );
    }
    const hashedPassword = await argon2.hash(data.newPassword);
    const result = await this.userService.updatePassword(
      user.id,
      hashedPassword,
    );
    if (!result) {
      throw new InternalServerErrorException('Update password failed');
    }
  }

  public async requestResetPassword(
    data: requestResetPasswordDto,
  ): Promise<string> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
        detail: 'User not found',
      });
    }

    const tokenForResetPassword =
      await this.tokenService.generateResetPasswordToken({
        action: 'Reset password',
        user_id: user._id.toString(),
      });
    const frontEndUrl = this.configService.get<string>('FRONT_END_URL');

    return `${frontEndUrl}/reset-password?token=${tokenForResetPassword}`;
  }
}
