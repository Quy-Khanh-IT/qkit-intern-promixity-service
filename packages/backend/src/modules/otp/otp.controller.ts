import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { CreateOTPRegistrationDto } from './dto/create-otp.dto';
import { OtpService } from './otp.service';

@Controller('otps')
@ApiTags('Otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  @Post('updating-email')
  @HttpCode(204)
  @ApiBody({
    type: CreateOTPRegistrationDto,
  })
  async createForUpdateEmail(
    @Body() data: CreateOTPRegistrationDto,
  ): Promise<void> {
    const result = await this.otpService.createForUpdateEmail(data.email);
    return this.mailService.sendOTPMail(
      data.email,
      'OTP Code for reseting email',
      result.otp,
    );
  }

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
