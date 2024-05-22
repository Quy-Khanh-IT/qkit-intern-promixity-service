import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
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

  @Post('updating-email')
  @HttpCode(204)
  @UseGuards(JwtAccessTokenGuard)
  async createForUpdatingEmail(
    @Body() data: CreateOTPRegistrationDto,
  ): Promise<void> {
    const result = await this.otpService.createForUpdateingEmail(data.email);
    return this.mailService.sendOTPMail(
      data.email,
      'OTP Code for updateing email',
      result.otp,
    );
  }
}
