import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exception filter/global.exception-filter';
import { DatabaseModule } from './cores/database/database.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';

import { join } from 'path';
import { TokenModule } from './modules/token/token.module';
import { AxiosModule } from './modules/axios/axios.module';
import { ExtractClientIpMiddleware } from 'src/cores/middlewares/extract-client-ip.middleware';
import { ServiceModule } from './modules/service/service.module';
import { CategoryModule } from './modules/category/category.module';
import { NominatimOmsModule } from './modules/nominatim-osm/nominatim-osm.module';

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
    BusinessModule,
    ServiceModule,
    CategoryModule,
    NominatimOmsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
