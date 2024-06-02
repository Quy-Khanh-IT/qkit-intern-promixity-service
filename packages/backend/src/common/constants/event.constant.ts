import { NotificationTypeEnum } from '../enums/notification.enum';

export const NOTIFICATION_TITLES = {
  [NotificationTypeEnum.CREATE_BUSINESS]: 'Business registered',
  [NotificationTypeEnum.CLOSE_BUSINESS]: 'Business closed',
  [NotificationTypeEnum.RESTORE_BUSINESS]: 'Business restored',
  [NotificationTypeEnum.REPORT_BUSINESS]: 'Business reported',
  [NotificationTypeEnum.REJECT_BUSINESS]: 'Business rejected',
  [NotificationTypeEnum.BANNED_BUSINESS]: 'Business banned',
};

export const NOTIFICATION_CONTENTS = {
  [NotificationTypeEnum.CREATE_BUSINESS]:
    'Your business has been successfully registered. Please waiting for approval.',
  [NotificationTypeEnum.CLOSE_BUSINESS]: 'Business has been closed',
  [NotificationTypeEnum.RESTORE_BUSINESS]: 'Business has been restored',
  [NotificationTypeEnum.REPORT_BUSINESS]: 'Business has been reported',
  [NotificationTypeEnum.REJECT_BUSINESS]: 'Business has been rejected',
  [NotificationTypeEnum.BANNED_BUSINESS]: 'Business has been banned',
};
