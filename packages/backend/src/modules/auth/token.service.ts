import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './key.payload';
import { JwtService } from '@nestjs/jwt';
import { ConfigKey } from 'src/common/constants';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>(ConfigKey.SECRET_KEY)}`,
      expiresIn: `${this.configService.get<string>(
        ConfigKey.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      )}s`,
    });
  }

  async generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>(ConfigKey.REFRESH_SECRET_KEY)}`,
      expiresIn: `${this.configService.get<string>(
        ConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      )}s`,
    });
  }

  async generateResetPasswordToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>(ConfigKey.RESET_PASSWORD_SECRET_KEY)}`,
      expiresIn: `${this.configService.get<string>(
        ConfigKey.JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
      )}s`,
    });
  }

  public async genNewPairToken(
    tokenPayload: TokenPayload,
  ): Promise<[string, string] | null> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        ...tokenPayload,
      }),
      this.generateRefreshToken({
        ...tokenPayload,
      }),
    ]);
    return [accessToken, refreshToken];
  }
}
