import {
  NotificationEnum,
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';
import { BaseEvent } from 'src/modules/notification/event/event.base';

export class ReportReviewEvent extends BaseEvent {
  getNotificationContent(): NotificationEnum {
    return NotificationEnum.REPORT_REVIEW;
  }
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.REPORT;
  }
  getResourceType(): NotificationResourceEnum {
    return NotificationResourceEnum.REVIEW;
  }
}
