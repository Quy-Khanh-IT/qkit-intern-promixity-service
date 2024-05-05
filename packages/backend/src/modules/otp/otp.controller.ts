import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTP } from './entities/otp.entity';
import { CreateOTPRegistrationDto } from './dto/create-otp.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';

@Controller('otps')
@ApiTags('Otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  @Post('registration')
  @HttpCode(204)
  @ApiBody({
    type: CreateOTPRegistrationDto,
  })
  async createForRegistration(
    @Body() data: CreateOTPRegistrationDto,
  ): Promise<void> {
    const result = await this.otpService.createForRegister(data.email);
    return this.mailService.sendOTPMail(
      data.email,
      'OTP Code for registration',
      result.otp,
    );
  }
}
