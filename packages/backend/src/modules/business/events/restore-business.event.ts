import {
  NotificationEnum,
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';
import { BaseEvent } from 'src/modules/notification/event/event.base';

export class RestoreBusinessEvent extends BaseEvent {
  getNotificationContent(): NotificationEnum {
    throw NotificationEnum.RESTORE_BUSINESS;
  }
  getResourceType(): NotificationResourceEnum {
    throw NotificationResourceEnum.BUSINESS;
  }
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.RESTORE;
  }
}
