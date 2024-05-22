import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business/business.module';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';
import { RequestModule } from '../request/request.module';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { AdminController } from './admin.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({}),
    UploadFileModule,
    RequestModule,
    ConfigModule,
    MailModule,
    forwardRef(() => OtpModule),
    forwardRef(() => BusinessModule),
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
