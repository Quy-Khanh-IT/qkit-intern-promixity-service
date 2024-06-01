import { NotificationTypeEnum } from 'src/common/enums/notification.enum';
import { BaseEvent } from 'src/modules/notification/event/event.base';

export class CloseBusinessEvent extends BaseEvent {
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.CLOSE_BUSINESS;
  }
}
