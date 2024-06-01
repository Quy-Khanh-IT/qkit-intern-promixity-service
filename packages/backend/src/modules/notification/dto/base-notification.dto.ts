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

  senderId: string;

  receiverId: string;
}
