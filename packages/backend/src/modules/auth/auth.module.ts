import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RequestModule } from '../request/request.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './stragegies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './stragegies/jwt-refresh-token.strategy';
import { JwtResetPasswordStrategy } from './stragegies/jwt-reset-token.strategy';
import { JwtVerifyEmailStrategy } from './stragegies/jwt-verify-token.strategy';
import { JWTTokenService } from './token.service';

@Module({
  imports: [
    OtpModule,
    MailModule,
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    RequestModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTTokenService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtResetPasswordStrategy,
    JwtVerifyEmailStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AuthModule {}
