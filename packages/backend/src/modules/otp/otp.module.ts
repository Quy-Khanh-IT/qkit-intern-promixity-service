import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { OTP, OTPSchema } from './entities/otp.entity';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpRepository } from './repository/otp.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OTP.name,
        schema: OTPSchema,
      },
    ]),
    MailModule,
    forwardRef(() => UserModule),
  ],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
})
export class OtpModule {}
