export enum RoleEnum {
  _ADMIN = 'admin',
  _USER = 'user',
  _BUSINESS = 'business'
}

export enum StatusEnum {
  _APPROVED = 'approved',
  _PENDING = 'pending',
  _REJECTED = 'rejected',
  _BANNED = 'banned',
  _CLOSED = 'closed',
  _DELETED = 'deleted'
}

export enum SortEnum {
  _ASC = 'asc',
  _DESC = 'desc'
}

export enum SortEnumAlias {
  _ASCEND = 'ascend',
  _DESCEND = 'descend'
}

export enum TableActionEnum {
  _SORT = 'sort'
}

export enum BooleanEnum {
  _TRUE = 'true',
  _FALSE = 'false'
}

export enum NotificationEnum {
  _CREATE_BUSINESS = 'create_business',
  _CLOSE_BUSINESS = 'close_business',
  _RESTORE_BUSINESS = 'restore_business',
  _REPORT_BUSINESS = 'report_business',
  _REJECT_BUSINESS = 'reject_business',
  _BANNED_BUSINESS = 'banned_business',
  _CREATE_USER = 'create_user',
  _NO_SPECIFIC_TYPE = 'no_specific_type'
}

export enum UserOptionEnum {
  _ACTIVE = 'active',
  _DELETED = 'deleted'
}
