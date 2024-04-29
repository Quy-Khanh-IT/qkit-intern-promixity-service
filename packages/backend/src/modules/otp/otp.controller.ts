import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTP } from './entities/otp.entity';
import { CreateOTPRegistrationDto } from './dto/create-otp.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('otps')
@ApiTags('Otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('registration')
  @HttpCode(204)
  @ApiBody({
    type: CreateOTPRegistrationDto,
  })
  async createForRegistration(
    @Body() data: CreateOTPRegistrationDto,
  ): Promise<void> {
    return await this.otpService.createForRegister(data.email);
  }
}
