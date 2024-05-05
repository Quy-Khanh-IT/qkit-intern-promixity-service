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
import { JwtAccessTokenStrategy } from './stragegies/jwt-access-token.stragegy';
import { JwtRefreshTokenStrategy } from './stragegies/jwt-refresh-token.stragegy';
import { TokenModule } from '../token/token.module';
import { JwtResetPasswordTokenGuard } from 'src/cores/guard/jwt-reset-password-token.guard';
import { JwtResetPasswordStrategy } from './stragegies/jwt-reset-token.stragegy';

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
