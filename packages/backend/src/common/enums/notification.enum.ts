export enum EventDispatcherEnum {
  CREATE_BUSINESS = 'create.business',
  CLOSE_BUSINESS = 'close.business',
  RESTORE_BUSINESS = 'restore.business',
  REPORT_BUSINESS = 'report.business',
  REJECT_BUSINESS = 'reject.business',
  BANNED_BUSINESS = 'banned.business',

  REPORT_REVIEW = 'report.review',
}

export enum NotificationEnum {
  CREATE_BUSINESS = 'create_business',
  CLOSE_BUSINESS = 'close_business',
  RESTORE_BUSINESS = 'restore_business',
  REPORT_BUSINESS = 'report_business',
  REJECT_BUSINESS = 'reject_business',
  BANNED_BUSINESS = 'banned_business',

  CREATE_USER = 'create_user',

  REPORT_REVIEW = 'report_review',
}

export enum NotificationTypeEnum {
  CREATE = 'create',
  CLOSE = 'close',
  RESTORE = 'restore',
  REPORT = 'report',
  REJECT = 'reject',
  BANNED = 'banned',
}

export enum NotificationResourceEnum {
  BUSINESS = 'business',
  REVIEW = 'review',
  USER = 'user',
}
