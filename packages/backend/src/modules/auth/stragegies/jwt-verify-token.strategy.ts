import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKey, ERRORS_DICTIONARY } from 'src/common/constants';
import { AuthConstant } from 'src/common/constants/auth.constant';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import TokenPayload from '../key.payload';

@Injectable()
export class JwtVerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify-email',
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(
        AuthConstant.VERIFY_STRATEGY_HEADER_NAME,
      ),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigKey.VERIFY_TOKEN_KEY), // replace with your secret key
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const user = await this.userService.findOneById(payload.user_id);
    if (!user) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.AUTH_EMAIL_NOT_EXISTED,
        detail: 'User not found',
      });
    }
    return user;
  }
}
