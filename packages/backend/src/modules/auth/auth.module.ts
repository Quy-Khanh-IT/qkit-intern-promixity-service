import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';

import { RequestModule } from '../request/request.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './stragegies/jwt-access-token.stragegy';
import { JwtRefreshTokenStrategy } from './stragegies/jwt-refresh-token.stragegy';
import { JwtResetPasswordStrategy } from './stragegies/jwt-reset-token.stragegy';
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
    JWTTokenService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtResetPasswordStrategy,
  ],
})
export class AuthModule {}
