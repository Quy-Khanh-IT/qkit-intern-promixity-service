import { ReviewActionEnum } from 'src/common/enums';
import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';

export interface NotificationRepositoryInterface {
  markAllAsRead(userId: string): Promise<boolean>;
}
