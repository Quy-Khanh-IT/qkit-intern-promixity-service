import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ERRORS_DICTIONARY } from 'src/common/constants';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import TokenPayload from '../key.payload';
import { User } from 'src/modules/user/entities/user.entity';

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
      jwtFromRequest: ExtractJwt.fromHeader('reset-token-header'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('RESET_PASSWORD_SECRET_KEY'), // replace with your secret key
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
