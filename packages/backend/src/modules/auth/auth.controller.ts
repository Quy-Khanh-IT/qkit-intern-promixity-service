import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignUpDto,
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
  RequestResetPasswordDto,
} from './dto/index';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtResetPasswordTokenGuard } from 'src/cores/guard/jwt-reset-password-token.guard';

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
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('reset-password')
  @ApiHeader({
    name: 'reset-token-header',
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
  @UseGuards(JwtResetPasswordTokenGuard)
  async resetPassword(@Body() data: ResetPasswordDto, @Req() req: Request) {
    const JWTtoken: string = req.headers['reset-token-header'].toString();
    await this.authService.resetPassword(data, req.user, JWTtoken);
  }

  @Post('reset-password/request')
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
