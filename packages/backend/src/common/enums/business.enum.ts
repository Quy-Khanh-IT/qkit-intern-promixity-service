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
  PENDING_APPROVED = 'pending_approved',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
}

export enum GetBusinessesByStatusEnum {
  PENDING_APPROVED = 'pending_approved',
  APPROVED = 'approved',
  DELETED = 'deleted',
  BANNED = 'banned',
  PENDING = 'pending',
}

export enum StatusActionsEnum {
  APPROVE = 'approve',
  REJECT = 'reject',
  BANNED = 'banned',
  PENDING = 'pending',
}

export const AvailableActions = {
  [GetBusinessesByStatusEnum.PENDING_APPROVED]: [
    BusinessStatusEnum.APPROVED,
    BusinessStatusEnum.REJECTED,
  ],

  [GetBusinessesByStatusEnum.APPROVED]: [
    BusinessStatusEnum.BANNED,
    BusinessStatusEnum.PENDING,
  ],

  [GetBusinessesByStatusEnum.PENDING]: [
    BusinessStatusEnum.BANNED,
    BusinessStatusEnum.APPROVED,
    BusinessStatusEnum.REJECTED,
  ],

  [GetBusinessesByStatusEnum.BANNED]: [
    BusinessStatusEnum.APPROVED,
    BusinessStatusEnum.PENDING,
  ],
};
