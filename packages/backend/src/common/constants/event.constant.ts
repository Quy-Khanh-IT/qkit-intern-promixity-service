export enum EventDispatcherEnum {
  CREATE_BUSINESS = 'create.business',
  CLOSE_BUSINESS = 'close.business',
  RESTORE_BUSINESS = 'restore.business',
  REPORT_BUSINESS = 'report.business',
}

export enum NotificationTypeEnum {
  CREATE_BUSINESS = 'create_business',
  CLOSE_BUSINESS = 'close_business',
  RESTORE_BUSINESS = 'restore_business',
  REPORT_BUSINESS = 'report_business',
}

export const NOTIFICATION_TITLES = {
  [NotificationTypeEnum.CREATE_BUSINESS]: 'Business registered',
  [NotificationTypeEnum.CLOSE_BUSINESS]: 'Business closed',
  [NotificationTypeEnum.RESTORE_BUSINESS]: 'Business restored',
  [NotificationTypeEnum.REPORT_BUSINESS]: 'Business reported',
};

export const NOTIFICATION_CONTENTS = {
  [NotificationTypeEnum.CREATE_BUSINESS]:
    'Your business has been successfully registered. Please waiting for approval.',
  [NotificationTypeEnum.CLOSE_BUSINESS]: 'Business has been closed',
  [NotificationTypeEnum.RESTORE_BUSINESS]: 'Business has been restored',
  [NotificationTypeEnum.REPORT_BUSINESS]: 'Business has been reported',
};
