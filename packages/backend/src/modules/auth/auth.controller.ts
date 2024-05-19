import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtRequestTokenGuard } from 'src/cores/guard/jwt-reset-password-token.guard';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponeDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto/index';

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

  @Post('login')
  @HttpCode(200)
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponeDto> {
    return await this.authService.login(loginDto);
  }

  @Post('reset-password')
  @ApiHeader({
    name: 'request-token-header',
    description: 'The reset password token',
  })
  @HttpCode(200)
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully reset.',
  })
  @UseGuards(JwtRequestTokenGuard)
  async resetPassword(@Body() data: ResetPasswordDto, @Req() req: Request) {
    const JWTtoken: string = req.headers['request-token-header'].toString();
    await this.authService.resetPassword(data, req.user, JWTtoken);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiBody({
    type: RequestResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Mail with one-time link has been sent.',
  })
  async requestResetPassword(@Body() data: RequestResetPasswordDto) {
    const resetLink = await this.authService.requestResetPassword(data);
    this.mailService.sendResetPasswordMail(
      data.email,
      'Reset Password Link Proximity service',
      resetLink,
    );
  }
}
