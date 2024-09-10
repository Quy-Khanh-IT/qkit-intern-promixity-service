import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './repository/notification.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory: () => {
          const schema = NotificationSchema;
          // schema.plugin(AutoIncrementID, {
          //   field: 'order', // Field to increment which exists in the schema
          //   startAt: 0,
          // });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
