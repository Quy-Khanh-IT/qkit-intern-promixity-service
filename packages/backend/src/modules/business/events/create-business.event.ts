import {
  NotificationEnum,
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';
import { BaseEvent } from 'src/modules/notification/event/event.base';

export class CreateBusinessEvent extends BaseEvent {
  getNotificationContent(): NotificationEnum {
    return NotificationEnum.CREATE_BUSINESS;
  }
  getResourceType(): NotificationResourceEnum {
    return NotificationResourceEnum.BUSINESS;
  }
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.CREATE;
  }
}
