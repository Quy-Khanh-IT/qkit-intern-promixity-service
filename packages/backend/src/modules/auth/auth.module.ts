import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTTokenService } from './token.service';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtResetPasswordStrategy } from './strategies/jwt-reset-token.strategy';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    OtpModule,
    MailModule,
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTTokenService,
    JWTTokenService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtResetPasswordStrategy,
  ],
})
export class AuthModule {}
