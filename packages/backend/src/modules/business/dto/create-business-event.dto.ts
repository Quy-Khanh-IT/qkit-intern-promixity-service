import { NotificationTypeEnum } from 'src/common/enums/notification.enum';

export class CreateBusinessEventDto {
  constructor(
    public type: NotificationTypeEnum,
    public senderId: string,
    public receiverId: string | null, // Allow receiverId to be string or null
    public content?: string,
    public title?: string, // Optional title
  ) {}
}
