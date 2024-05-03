import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { MailConstant } from 'src/common/constants';
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: this.configService.get<string>('GOOGLE_USERNAME'),
        pass: this.configService.get<string>('GOOGLE_PASSWORD'),
      },
    });

    return transporter;
  }

  async sendEmail(email: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = this.emailTransport();

      const message = {
        from:
          'Proximity Service' +
          '<' +
          this.configService.get<string>('GOOGLE_USERNAME') +
          '>',
        to: email,
        subject: subject,
        html: html,
      };
      transporter.sendMail({ ...message });
    } catch (err) {
      console.error(err);
    }
  }

  async sendOTPMail(email: string, subject: string, otpCode: string) {
    const htmlTemplate = fs.readFileSync(
      MailConstant.MAIL_OTP_HTML_LINK,
      'utf8',
    );
    const emailContent = htmlTemplate.replace(
      MailConstant.OTP_CODE_VARIABLE,
      otpCode,
    );

    return this.sendEmail(email, subject, emailContent);
  }

  async sendWelcomeMail(email: string, subject: string) {
    const emailContent = fs.readFileSync(
      MailConstant.MAIL_WELCOME_HTML_LINK,
      'utf8',
    );

    return this.sendEmail(email, subject, emailContent);
  }

  async sendResetPasswordMail(
    email: string,
    subject: string,
    resetLink: string,
  ) {
    // const htmlTemplate = fs.readFileSync(
    //   'src/common/views/reset-password.html',
    //   'utf8',
    // );
    const htmlTemplate =
      "<h1>Reset Password</h1><p>Click the link below to reset your password</p><a href='{{resetLink}}'>Reset Password</a>";
    const emailContent = htmlTemplate.replace('{{resetLink}}', resetLink);

    return this.sendEmail(email, subject, emailContent);
  }
}
