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
} from 'src/common/constants';
import { AuthConstant } from 'src/common/constants/auth.constant';
import { TypeRequests } from 'src/common/enums';
import {
  EmailExistedException,
  EmailNotExistedException,
  OTPNotMatchException,
  TokenExpiredException,
  TokenResetExceededLimitException,
  UserNotFoundException,
  WrongCredentialsException,
} from 'src/common/exceptions';
import { verifyHash } from 'src/common/utils';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { RequestService } from '../request/request.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {
  LoginDto,
  LoginResponeDto,
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

  public async signUp(registrationData: SignUpDto): Promise<User> {
    const isExistingEmail = await this.userService.checkEmailExist(
      registrationData.email,
    );
    if (isExistingEmail) {
      throw new EmailExistedException();
    }

    const otps = await this.otpService.findManyByEmail(
      registrationData.email,
      5,
    );

    if (!otps.count || otps.items[0].otp !== registrationData.otp) {
      throw new OTPNotMatchException();
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
      throw new EmailNotExistedException();
    }
    const isMatchingPassword = await verifyHash(
      user.password,
      loginData.password,
    );
    if (!isMatchingPassword) {
      throw new WrongCredentialsException();
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
