import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './entities/business.entity';
import { BusinessRepository } from './repository/business.repository';
import { UserModule } from '../user/user.module';
import { AxiosModule } from '../axios/axios.module';
import { forwardRef } from '@nestjs/common';
import { ExtractClientIpMiddleware } from 'src/cores/middlewares/extract-client-ip.middleware';
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
export class BusinessModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractClientIpMiddleware).forRoutes('businesses');
  }
}
