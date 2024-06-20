import {
  NOTIFICATION_CONTENTS,
  NOTIFICATION_TITLES,
} from 'src/common/constants/event.constant';
import {
  NotificationEnum,
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';

import { BaseEventDto } from '../dto/base-event.dto';

// Base event class that requires specific type
export abstract class BaseEvent {
  constructor(public payload: Omit<BaseEventDto, 'type' | 'resource'>) {
    const title =
      payload.title ||
      NOTIFICATION_TITLES[this.getNotificationContent()] ||
      'Empty title';

    const content =
      payload.content ||
      NOTIFICATION_CONTENTS[this.getNotificationContent()] ||
      'Empty content';

    console.log('this.payload', this.payload);

    this.payload = {
      ...payload,
      title,
      content,
      type: this.getEventType(),
      resource: this.getResourceType(),
    } as BaseEventDto;
  }

  // Abstract method to get the specific event type
  abstract getNotificationContent(): NotificationEnum;

  abstract getEventType(): NotificationTypeEnum;

  abstract getResourceType(): NotificationResourceEnum;
}
