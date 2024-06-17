import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AxiosModule } from '../axios/axios.module';
import { CategoryModule } from '../category/category.module';
import { NominatimOmsModule } from '../nominatim-osm/nominatim-osm.module';
import { ReviewModule } from '../review/review.module';
import { ServiceModule } from '../service/service.module';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { UserModule } from '../user/user.module';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { Business, BusinessSchema } from './entities/business.entity';
import { BusinessRepository } from './repository/business.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Business.name,
        schema: BusinessSchema,
      },
    ]),
    forwardRef(() => UserModule),
    AxiosModule,
    HttpModule,
    NominatimOmsModule,
    UploadFileModule,
    ServiceModule,
    CategoryModule,
    forwardRef(() => ReviewModule),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository],
  exports: [BusinessService],
})
export class BusinessModule {}
