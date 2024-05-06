import { Module } from '@nestjs/common';
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
    UserModule,
  ],
  controllers: [BusinessController],
  providers: [
    BusinessService,
    BusinessRepository,
    BusinessSoftDeleteRepository,
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
