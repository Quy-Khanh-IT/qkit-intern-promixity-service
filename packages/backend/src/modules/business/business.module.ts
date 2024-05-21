import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './entities/business.entity';
import { BusinessRepository } from './repository/business.repository';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AxiosModule } from '../axios/axios.module';
import { forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NominatimOmsModule } from '../nominatim-osm/nominatim-osm.module';

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
  ],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository],
  exports: [BusinessService],
})
export class BusinessModule {}
