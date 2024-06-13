import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { Notification } from '../entities/notification.entity';
import { NotificationRepositoryInterface } from '../interfaces/notification-repo.interface';

export class NotificationRepository
  extends BaseRepositoryAbstract<Notification>
  implements NotificationRepositoryInterface
{
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await this.notificationModel.updateMany(
      { receiverId: userId },
      { isRead: true },
    );

    return !!result;
  }
}
