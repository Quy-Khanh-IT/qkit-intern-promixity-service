import {
  NotificationTypeEnum,
  ResourceEnum,
} from 'src/common/enums/notification.enum';

export class EventBase {
  title: string;
  content: string;
  resource: ResourceEnum;
  type: NotificationTypeEnum;
  userId?: string;
  url?: string;
}
