import { NotificationTypeEnum } from 'src/common/enums/notification.enum';
import { BaseEvent } from 'src/modules/notification/event/event.base';

export class ReportBusinessEvent extends BaseEvent {
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.REPORT_BUSINESS;
  }
}