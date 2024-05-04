import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  SignUpDto,
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
  requestResetPasswordDto,
} from './dto/index';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { Request } from 'express';
import { JwtResetPasswordStrategy } from './strategies/jwt-reset-token.strategy';
import { JwtResetPasswordTokenGuard } from 'src/cores/guard/jwt-reset-password-token';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  @HttpCode(201)
  @ApiBody({
    type: SignUpDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up.',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signUp(signUpDto);
    this.mailService.sendWelcomeMail(
      result.email,
      'Welcome to our Proximity Service',
    );
  }

  @Post('reset-password/request')
  @HttpCode(200)
  @ApiBody({
    type: requestResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully reset.',
  })
  async requestResetPassword(@Body() data: requestResetPasswordDto) {
    const resetPasswordLink = await this.authService.requestResetPassword(data);

    this.mailService.sendResetPasswordMail(
      data.email,
      'Reset Password',
      resetPasswordLink,
    );
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('reset-password/reset')
  @ApiHeader({
    name: 'reset-token-header',
    description: 'The reset password token',
  })
  @UseGuards(JwtResetPasswordTokenGuard)
  @HttpCode(200)
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully reset.',
  })
  async resetPassword(@Req() req: Request, @Body() data: ResetPasswordDto) {
    await this.authService.resetPassword(data, req.user.email);
  }
}
