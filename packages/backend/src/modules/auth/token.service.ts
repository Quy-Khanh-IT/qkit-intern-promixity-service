import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigKey } from 'src/common/constants';
import TokenPayload from './key.payload';

@Injectable()
export class JWTTokenService {
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

  async generateVerifyToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>(ConfigKey.VERIFY_TOKEN_KEY)}`,
      expiresIn: `${this.configService.get<string>(
        ConfigKey.JWT_VERIFY_TOKEN_EXPIRATION_TIME,
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
      secret: `${this.configService.get<number>(ConfigKey.REQUEST_SECRET_KEY)}`,
      expiresIn: `${this.configService.get<string>(
        ConfigKey.JWT_REQUEST_TOKEN_EXPIRATION_TIME,
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
