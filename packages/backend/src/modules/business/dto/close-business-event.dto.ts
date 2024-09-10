import { NotificationTypeEnum } from 'src/common/enums/notification.enum';

export class CloseBusinessEventDto {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly type: NotificationTypeEnum,
    public readonly senderId: string,
    public readonly receiverId: string,
  ) {}
}
