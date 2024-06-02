export enum DayEnum {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum DeleteActionEnum {
  SOFT = 'soft',
  HARD = 'hard',
}

export enum BusinessStatusEnum {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
  CLOSED = 'closed',
  PENDING = 'pending',
}

export enum StatusActionsEnum {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
  CLOSED = 'closed',
}

export const OrderNumberDay = {
  [DayEnum.MONDAY]: 1,
  [DayEnum.TUESDAY]: 2,
  [DayEnum.WEDNESDAY]: 3,
  [DayEnum.THURSDAY]: 4,
  [DayEnum.FRIDAY]: 5,
  [DayEnum.SATURDAY]: 6,
  [DayEnum.SUNDAY]: 7,
} as const;

export const AvailableActions = {};
