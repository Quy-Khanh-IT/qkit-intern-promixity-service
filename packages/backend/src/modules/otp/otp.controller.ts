import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTP } from './entities/otp.entity';
import { CreateOTPDto } from './dto/create-otp.dto';

@Controller('otps')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('registration')
  @HttpCode(204)
  async createForRegistration(@Body() data: CreateOTPDto): Promise<void> {
    return await this.otpService.createForRegister(data.email);
  }
}
