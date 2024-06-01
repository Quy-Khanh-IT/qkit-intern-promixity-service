import { IsEnum, IsString } from 'class-validator';
import {
  NotificationTypeEnum,
  ResourceEnum,
} from 'src/common/enums/notification.enum';

export class BaseEventDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsEnum({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  senderId: string;

  receiverId: string | null; // set null if send to admin
}
