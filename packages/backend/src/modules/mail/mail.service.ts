import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendOTPMail(email: string, subject: string, otpCode: string) {
    this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: './OTP-form',
      context: {
        otp: otpCode,
      },
    });
  }

  async sendWelcomeMail(email: string, subject: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to proximity service',
      template: './registration-form',
    });
  }

  async sendDeletedUserMail(email: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Check your account on Proximity Service now!',
      template: './deleted-user',
    });
  }

  async sendResetPasswordMail(
    email: string,
    subject: string,
    resetLink: string,
  ) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password in Proximity Service',
      template: './reset-password',
      context: {
        resetLink: resetLink,
      },
    });
  }

  async sendResetEmailMail(email: string, subject: string, resetLink: string) {
    this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: './reset-email',
      context: {
        resetLink: resetLink,
      },
    });
  }
}
