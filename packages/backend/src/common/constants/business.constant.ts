export class BusinessConstant {
  static readonly regexOpenCloseTime: RegExp =
    /^(?:[01]\d|2[0-3]):(?:00|0[5]|1[05]|2[05]|3[05]|4[05]|5[05])$/;

  // /^(?:[01]?\d|2[0-4]):(?:00|0[5]|1[05]|2[05]|3[05]|4[05]|5[05])$/ regex allow HH receives 0 or 08
}

// Path: packages/backend/src/common/constants/business.constant.ts
