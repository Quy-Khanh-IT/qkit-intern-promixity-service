import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './entities/business.entity';
import {
  BusinessRepository,
  BusinessSoftDeleteRepository,
} from './repository/business.repository';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AxiosModule } from '../axios/axios.module';
import { forwardRef } from '@nestjs/common';
import { ExtractClientIpMiddleware } from 'src/cores/middlewares/extract-client-ip.middleware';
import { HttpModule } from '@nestjs/axios';
import { NominatimOmsModule } from '../nominatim-osm/nominatim-osm.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Business.name,
        useFactory: () => {
          const schema = BusinessSchema;
          schema.plugin(require('mongoose-delete'), {
            deletedAt: true,
            overrideMethods: 'all',
          });
          return schema;
        },
      },
    ]),
    forwardRef(() => UserModule),
    AxiosModule,
    HttpModule,
    NominatimOmsModule,
  ],
  controllers: [BusinessController],
  providers: [
    BusinessService,
    BusinessRepository,
    BusinessSoftDeleteRepository,
  ],
  exports: [BusinessService],
})
export class BusinessModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractClientIpMiddleware).forRoutes('businesses');
  }
}
