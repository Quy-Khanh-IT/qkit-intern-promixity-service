import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './common/exception filter/global.exception-filter';
import { DatabaseModule } from './cores/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { OtpModule } from './modules/otp/otp.module';
import { RequestModule } from './modules/request/request.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { UserModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
import { SeedService } from './seeds/seed.service';
import { DistrictModule } from './modules/address/district.module';
import { ProvinceModule } from './modules/address/province.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number(),
      }),
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    UploadFileModule,
    DatabaseModule,
    UserModule,
    OtpModule,
    AuthModule,
    RequestModule,
    AddressModule,
    DistrictModule,
    ProvinceModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [
    SeedService,
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {
    this.seed();
  }

  async seed() {
    await this.seedService.seedDistricts();
    await this.seedService.seedProvinces();
  }
}
