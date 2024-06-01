import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERRORS_DICTIONARY } from 'src/common/constants';
import TokenPayload from 'src/modules/auth/key.payload';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
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
