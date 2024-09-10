import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './common/exception filter/global.exception-filter';
import { DatabaseModule } from './cores/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { OtpModule } from './modules/otp/otp.module';
import { RequestModule } from './modules/request/request.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { UserModule } from './modules/user/user.module';

import { ThrottlerModule } from '@nestjs/throttler';
import { AddressModule } from './modules/address/address.module';
import { DistrictModule } from './modules/address/district.module';
import { ProvinceModule } from './modules/address/province.module';
import { CategoryModule } from './modules/category/category.module';
import { NominatimOmsModule } from './modules/nominatim-osm/nominatim-osm.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReviewModule } from './modules/review/review.module';
import { ServiceModule } from './modules/service/service.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SeedService } from './seeds/seed.service';

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
    BusinessModule,
    ServiceModule,
    CategoryModule,
    NominatimOmsModule,
    AddressModule,
    DistrictModule,
    ProvinceModule,
    AddressModule,
    ReviewModule,
    StatisticsModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
    ]),
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
