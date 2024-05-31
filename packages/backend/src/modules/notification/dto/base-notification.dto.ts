import { IsEnum, IsString } from 'class-validator';
import {
  NotificationTypeEnum,
  ResourceEnum,
} from 'src/common/enums/notification.enum';

export class BaseNotificationDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  sendBy: {
    id: string;
    name: string;
  };

  receiveBy: {
    id: string;
    name: string;
  };
}
