import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
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

  async sendEmail(email: string, subject: string, html: string) {
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
}
