import { NotificationEnum } from '../enums/notification.enum';

export const NOTIFICATION_TITLES = {
  [NotificationEnum.CREATE_BUSINESS]: 'Business registered',
  [NotificationEnum.CLOSE_BUSINESS]: 'Business closed',
  [NotificationEnum.RESTORE_BUSINESS]: 'Business restored',
  [NotificationEnum.REPORT_BUSINESS]: 'Business reported',
  [NotificationEnum.REJECT_BUSINESS]: 'Business rejected',
  [NotificationEnum.BANNED_BUSINESS]: 'Business banned',
};

export const NOTIFICATION_CONTENTS = {
  [NotificationEnum.CREATE_BUSINESS]:
    'Your business has been successfully registered. Please waiting for approval.',
  [NotificationEnum.CLOSE_BUSINESS]: 'Business has been closed',
  [NotificationEnum.RESTORE_BUSINESS]: 'Business has been restored',
  [NotificationEnum.REPORT_BUSINESS]: 'Business has been reported',
  [NotificationEnum.REJECT_BUSINESS]: 'Business has been rejected',
  [NotificationEnum.BANNED_BUSINESS]: 'Business has been banned',
};
