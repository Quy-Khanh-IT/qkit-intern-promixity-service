import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto, LoginDto, LoginResponeDto } from './dto/index';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return await this.authService.signUp(signUpDto);
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
