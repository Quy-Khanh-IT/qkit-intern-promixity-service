import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import * as dayjs from 'dayjs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKey, ERRORS_DICTIONARY } from 'src/common/constants';
import { AuthConstant } from 'src/common/constants/auth.constant';
import { TypeRequests } from 'src/common/enums';
import { InvalidRefreshTokenException } from 'src/common/exceptions';
import TokenPayload from 'src/modules/auth/key.payload';
import { RequestService } from 'src/modules/request/request.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly requestService: RequestService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigKey.REFRESH_SECRET_KEY),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken =
      request.headers[AuthConstant.REFRESH_TOKEN_HEADER_NAME].split(' ')[1];

    const refreshRequest = await this.requestService.populateWithUserId(
      payload.user_id,
      TypeRequests.REFRESH_TOKEN,
    );
    if (!refreshRequest) {
      throw new InvalidRefreshTokenException();
    }
    if (
      refreshRequest.token !== refreshToken ||
      dayjs().isAfter(dayjs(refreshRequest.expiredAt.toDateString()))
    ) {
      throw new InvalidRefreshTokenException();
    }
    const currentUser: any = refreshRequest.userId;
    if (currentUser['isVerified'] === false) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
        detail: 'User not found',
      });
    }
    return plainToClass(User, currentUser);
  }
}
