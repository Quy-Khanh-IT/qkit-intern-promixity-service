import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard)
  async createForUpdatingEmail(@Req() req: Request): Promise<void> {
    return await this.otpService.createForUpdatingEmail(req.user.email);
  }
}
