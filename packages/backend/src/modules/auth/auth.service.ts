import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as Dayjs from 'dayjs';
import {
  ConfigKey,
  ERRORS_DICTIONARY,
  ERROR_MESSAGES,
  OTPConstant,
} from 'src/common/constants';
import { AuthConstant } from 'src/common/constants/auth.constant';
import { TypeRequests, UserRole } from 'src/common/enums';
import {
  EmailExistedException,
  EmailNotExistedException,
  OTPNotMatchException,
  PhoneExistedException,
  TokenExpiredException,
  TokenResetExceededLimitException,
  UnVerifiedUser,
  UserNotFoundException,
  WrongCredentialsException,
} from 'src/common/exceptions';
import { transObjectIdToString, verifyHash } from 'src/common/utils';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { Requests } from '../request/entities/request.entity';
import { RequestService } from '../request/request.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {
  LoginDto,
  LoginResponseDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dto/index';
import { SignUpDto } from './dto/sign-up.dto';
import { JWTTokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly JWTTokenService: JWTTokenService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly requestService: RequestService,
  ) {}

  public async verifyUser(user: User, otp: string): Promise<boolean> {
    const otps = await this.otpService.findManyByEmail(user.email, 5);

    if (!otps.count || otps.items[0].otp !== otp) {
      throw new OTPNotMatchException();
    }

    await this.userService.updateVerifiedStatusByEmail(user.id, true);

    this.mailService.sendWelcomeMail(
      user.email,
      'Welcome to our Proximity Service',
    );
    return true;
  }

  public async signUp(registrationData: SignUpDto): Promise<string> {
    const isExistingEmail = await this.userService.checkEmailExist(
      registrationData.email,
    );
    if (isExistingEmail) {
      throw new EmailExistedException();
    }

    const isExistingPhone = await this.userService.checkPhoneExist(
      registrationData.phoneNumber,
    );

    if (isExistingPhone) {
      throw new PhoneExistedException();
    }

    const hashedPassword: string = await argon2.hash(registrationData.password);

    const result = await this.userService.create({
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email,
      password: hashedPassword,
      phoneNumber: registrationData.phoneNumber,
      role: UserRole.USER,
      image: null,
      isVerified: false,
    });

    const [jwtToken, otpResult] = await Promise.all([
      this.JWTTokenService.generateVerifyToken({
        action: 'verify',
        user_id: transObjectIdToString(result._id),
      }),
      this.otpService.createForRegister(registrationData.email),
    ]);
    this.mailService.sendOTPMail(
      registrationData.email,
      'OTP Code for registration',
      otpResult.otp,
    );
    return jwtToken;
  }

  public async login(loginData: LoginDto): Promise<LoginResponseDto | void> {
    const user = await this.userService.findOneByEmail(loginData.email);
    if (!user) {
      throw new EmailNotExistedException();
    }
    const isMatchingPassword = await verifyHash(
      user.password,
      loginData.password,
    );
    if (!isMatchingPassword) {
      throw new WrongCredentialsException();
    }

    if (!user.isVerified) {
      return this.processLoginWithUnVerifiedUser(user);
    }

    const pairToken = await this.JWTTokenService.genNewPairToken({
      user_id: user._id.toString(),
      action: 'login',
    });

    const newRefreshToken: Requests = {
      token: pairToken[1],
      expiredAt: Dayjs()
        .add(
          this.configService.get<number>(
            ConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
          ),
          'seconds',
        )
        .toDate(),
      used: false,
      metaData: {},
      type: TypeRequests.REFRESH_TOKEN,
      userId: user._id,
    };

    const isSavedRefreshToken =
      await this.requestService.findOneAndReplaceWithUserId(
        user._id.toString(),
        newRefreshToken,
      );

    if (!isSavedRefreshToken) {
      throw new InternalServerErrorException('Save refresh token failed');
    }

    return {
      accessToken: pairToken[0],
      refreshToken: pairToken[1],
      userId: user.id,
      expiredAt: newRefreshToken.expiredAt,
    };
  }

  async processLoginWithUnVerifiedUser(user: User): Promise<void> {
    const jwt = await this.JWTTokenService.generateVerifyToken({
      action: 'verify',
      user_id: user.id,
    });
    const otpCodes = await this.otpService.findManyByEmail(user.email, 5);
    if (otpCodes.count < OTPConstant.OTP_MAX_VERIFY_EMAIL) {
      const newOtpCode = await this.otpService.createForRegister(user.email);
      this.mailService.sendOTPMail(
        user.email,
        'OTP Code for registration',
        newOtpCode.otp,
      );
    }
    throw new UnVerifiedUser(jwt);
  }

  async refreshToken(user: User): Promise<LoginResponseDto> {
    const userIdString = user.id ? user.id : user._id.toString();
    const pairToken = await this.JWTTokenService.genNewPairToken({
      user_id: userIdString,
      action: 'login',
    });
    const newRefreshToken: Requests = {
      token: pairToken[1],
      expiredAt: Dayjs()
        .add(
          this.configService.get<number>(
            ConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
          ),
          'seconds',
        )
        .toDate(),
      used: false,
      metaData: {},
      type: TypeRequests.REFRESH_TOKEN,
      userId: user._id,
    };

    const isSavingRefreshToken =
      await this.requestService.findOneAndReplaceWithUserId(
        userIdString,
        newRefreshToken,
      );

    if (!isSavingRefreshToken) {
      throw new InternalServerErrorException('Save refresh token failed');
    }

    return {
      accessToken: pairToken[0],
      refreshToken: pairToken[1],
      userId: userIdString,
      expiredAt: newRefreshToken.expiredAt,
    };
  }

  public async requestResetPassword(
    data: RequestResetPasswordDto,
  ): Promise<string> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const tokens = await this.requestService.findManyByUserIdAndType(
      user._id.toString(),
      TypeRequests.FORGOT_PASSWORD,
    );

    if (tokens.count >= AuthConstant.TOKEN_RESET_LIMIT_TIME) {
      throw new TokenResetExceededLimitException();
    }

    const newJWTToken = await this.JWTTokenService.generateResetPasswordToken({
      user_id: user._id.toString(),
      action: 'reset password',
    });

    const expiredTime = Dayjs()
      .add(
        this.configService.get<number>(
          ConfigKey.JWT_REQUEST_TOKEN_EXPIRATION_TIME,
        ),
        'seconds',
      )
      .valueOf();

    await this.requestService.createRequest({
      token: newJWTToken,
      expiredTime: expiredTime,
      used: false,
      metaData: {},
      type: TypeRequests.FORGOT_PASSWORD,
      userId: user._id,
    });

    const newResetLink = `${this.configService.get<string>(ConfigKey.FRONT_END_URL)}${AuthConstant.FORGOT_STRING_PATH}?token=${newJWTToken}`;
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

    const tokens = await this.requestService.findManyByUserIdAndType(
      user.id,
      TypeRequests.FORGOT_PASSWORD,
    );
    if (
      !tokens.count ||
      tokens.items[0].used === true ||
      tokens.items[0].token !== token
    ) {
      throw new TokenExpiredException();
    }

    const hashedPassword = await argon2.hash(data.newPassword);
    const result = await this.userService.updatePassword(
      user.id,
      hashedPassword,
    );
    if (!result) {
      throw new InternalServerErrorException('Update password failed');
    }

    await this.requestService.updateRequestStatus(tokens.items[0].id, true);
  }
}
