import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto, LoginDto, LoginResponeDto } from './dto/index';
import { MailService } from '../mail/mail.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
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
    type: LoginResponeDto,
    description: 'User successfully login.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponeDto> {
    return await this.authService.login(loginDto);
  }
}
