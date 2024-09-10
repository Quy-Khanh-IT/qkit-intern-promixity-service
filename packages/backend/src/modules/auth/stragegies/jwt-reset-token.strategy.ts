import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKey, ERRORS_DICTIONARY } from 'src/common/constants';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import TokenPayload from '../key.payload';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-reset-password',
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('request-token-header'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigKey.REQUEST_SECRET_KEY), // replace with your secret key
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const user = await this.userService.findVerifiedOneWithId(payload.user_id);
    if (!user) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
        detail: 'User not found',
      });
    }
    return user;
  }
}
