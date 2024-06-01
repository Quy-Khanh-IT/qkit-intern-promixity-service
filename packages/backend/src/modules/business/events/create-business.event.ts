import { BaseEvent } from 'src/modules/notification/event/event.base';
import { NotificationTypeEnum } from 'src/common/enums/notification.enum';

export class CreateBusinessEvent extends BaseEvent {
  getEventType(): NotificationTypeEnum {
    return NotificationTypeEnum.CREATE_BUSINESS;
  }
}
