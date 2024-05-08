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
import {
  ConfigKey,
  ERRORS_DICTIONARY,
  ERROR_MESSAGES,
} from 'src/common/constants';
import { User } from '../user/entities/user.entity';
import {
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
  RequestResetPasswordDto,
} from './dto/index';
import { verifyHash } from 'src/common/utils';
import { JWTTokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { OTP } from '../otp/entities/otp.entity';
import { TokenService } from '../token/token.service';
import * as Dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly JWTTokenService: JWTTokenService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
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

  public async login(loginData: LoginDto): Promise<LoginResponseDto> {
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
    const pairToken = await this.JWTTokenService.genNewPairToken({
      user_id: user._id.toString(),
      action: 'login',
    });
    return {
      accessToken: pairToken[0],
      refreshToken: pairToken[1],
    };
  }

  public async requestResetPassword(
    data: RequestResetPasswordDto,
  ): Promise<string> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.USER_NOT_FOUND],
        },
        404,
      );
    }

    const tokens = await this.tokenService.findManyByUserId(
      user._id.toString(),
    );

    if (tokens.count >= 5) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_TOKEN_RESET_EXEEDED_LIMIT,
          detail:
            ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_TOKEN_RESET_EXEEDED_LIMIT],
        },
        429,
      );
    }

    const newJWTToken = await this.JWTTokenService.generateResetPasswordToken({
      user_id: user._id.toString(),
      action: 'reset password',
    });

    const expiredTime = Dayjs()
      .add(
        this.configService.get<number>(
          ConfigKey.JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
        ),
        'seconds',
      )
      .valueOf();

    await this.tokenService.createToken({
      token: newJWTToken,
      expiredTime: expiredTime,
      used: false,
      userId: user._id,
    });

    const newResetLink = `${this.configService.get<string>(ConfigKey.FRONT_END_URL)}/reset-password?token=${newJWTToken}`;
    return newResetLink;
  }

  public async resetPassword(
    data: ResetPasswordDto,
    user: User,
    token: string,
  ): Promise<void> {
    if (data.newPassword !== data.confirmPassword) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_PASSWORD_NOT_MATCH],
        },
        403,
      );
    }

    const tokens = await this.tokenService.findManyByUserId(user.id);
    if (
      !tokens.count ||
      tokens.items[0].used === true ||
      tokens.items[0].token !== token
    ) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.AUTH_TOKEN_EXPIRED,
          detail: ERROR_MESSAGES[ERRORS_DICTIONARY.AUTH_TOKEN_EXPIRED],
        },
        400,
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

    await this.tokenService.updateTokenStatus(tokens.items[0].id, true);
  }
}
