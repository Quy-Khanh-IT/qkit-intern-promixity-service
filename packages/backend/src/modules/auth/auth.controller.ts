import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthConstant } from 'src/common/constants/auth.constant';
import { JwtRefreshTokenGuard } from 'src/cores/guard/jwt-refresh-token.guard';
import { JwtRequestTokenGuard } from 'src/cores/guard/jwt-reset-password-token.guard';
import { JwtVerifyTokenGuard } from 'src/cores/guard/jwt-verify-token.guard';
import { MailService } from '../mail/mail.service';
import { NoContentResponseDto } from '../user/dto/change-password.response.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponseDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto/index';
import { UnVerifyResponseDto } from './dto/unverify-response.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

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
  async signUp(@Body() signUpDto: SignUpDto): Promise<UnVerifyResponseDto> {
    const result = await this.authService.signUp(signUpDto);
    return {
      token: result,
      message: 'Verify Unsuccessfully.! Please verify your email',
    };
  }

  @Post('verify-email')
  @HttpCode(200)
  @ApiHeader({
    name: AuthConstant.VERIFY_STRATEGY_HEADER_NAME,
    description: 'The verification token',
  })
  @UseGuards(JwtVerifyTokenGuard)
  @ApiResponse({
    status: 200,
    description: 'User successfully verified.',
  })
  async verifyEmail(
    @Body() data: VerifyEmailDto,
    @Req() req: Request,
  ): Promise<NoContentResponseDto> {
    return {
      isSuccess: await this.authService.verifyUser(req.user, data.otp),
    };
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
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto | void> {
    return await this.authService.login(loginDto);
  }

  @Post('refreshToken')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtRefreshTokenGuard)
  @ApiResponse({
    status: 200,
    description: 'User successfully refresh token.',
  })
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken(req.user);
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
