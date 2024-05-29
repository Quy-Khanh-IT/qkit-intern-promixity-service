import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';

import { Service, ServiceSchema } from './entities/service.entity';
import { ServiceRepository } from './repository/service.repository';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Service.name,
        useFactory: () => {
          const schema = ServiceSchema;
          schema.plugin(AutoIncrementID, {
            field: 'order', // Field to increment which exists in the schema
            startAt: 0,
          });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceService],
})
export class ServiceModule {}
