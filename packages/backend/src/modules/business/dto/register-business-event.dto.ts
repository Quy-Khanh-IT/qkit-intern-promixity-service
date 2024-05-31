import {
  NotificationTypeEnum,
  ResourceEnum,
} from 'src/common/enums/notification.enum';
import { BaseNotificationDto } from 'src/modules/notification/dto/base-notification.dto';

export class RegisterBusinessEventDto {
  constructor(
    public title: string,
    public content: string,
    public type: NotificationTypeEnum.CREATE_BUSINESS,
    public sendBy: {
      id: string;
      name: string;
    },
    public receiveBy: {
      id: string;
      name: string;
    },
  ) {}
}
