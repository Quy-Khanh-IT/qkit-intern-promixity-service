import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../entities/notification.entity';

export class NotificationRepository extends BaseRepositoryAbstract<Notification> {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }
}
