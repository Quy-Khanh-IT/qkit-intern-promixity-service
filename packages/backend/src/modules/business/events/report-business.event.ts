import { BaseEvent } from 'src/modules/notification/event/event.base';
import { NotificationTypeEnum } from 'src/common/enums/notification.enum';

export class ReportBusinessEvent extends BaseEvent {
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.REPORT_BUSINESS;
  }
}
