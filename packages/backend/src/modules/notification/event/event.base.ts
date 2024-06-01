import { NotificationTypeEnum } from 'src/common/enums/notification.enum';
import { BaseEventDto } from '../dto/base-event.dto';
import { CreateBusinessEventDto } from 'src/modules/business/dto/create-business-event.dto';
import {
  NOTIFICATION_TITLES,
  NOTIFICATION_CONTENTS,
} from 'src/common/constants/event.constant';

// Base event class that requires specific type
export abstract class BaseEvent {
  constructor(public payload: Omit<BaseEventDto, 'type'>) {
    const title =
      payload.title ||
      NOTIFICATION_TITLES[this.getEventType()] ||
      'Empty title';

    const content =
      payload.content ||
      NOTIFICATION_CONTENTS[this.getEventType()] ||
      'Empty content';

    this.payload = {
      ...payload,
      title,
      content,
      type: this.getEventType(),
    } as BaseEventDto;
  }

  // Abstract method to get the specific event type
  abstract getEventType(): NotificationTypeEnum;
}
