import {
  NotificationEnum,
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';
import { BaseEvent } from 'src/modules/notification/event/event.base';

export class ReportBusinessEvent extends BaseEvent {
  getNotificationContent(): NotificationEnum {
    throw NotificationEnum.BANNED_BUSINESS;
  }
  getResourceType(): NotificationResourceEnum {
    throw NotificationResourceEnum.BUSINESS;
  }
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.REPORT;
  }
}
