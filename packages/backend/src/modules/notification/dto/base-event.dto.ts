import { IsEnum, IsString } from 'class-validator';
import {
  NotificationEnum,
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';

export class BaseEventDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsEnum({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  @IsEnum({ enum: NotificationResourceEnum })
  resource: NotificationResourceEnum;

  senderId: string;

  receiverId: string | null; // set null if send to admin
}
