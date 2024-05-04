export class UserConstant {
  static readonly regexPassword: RegExp =
    /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,25}$/;
}
// Path: packages/backend/src/common/constants/user.constant.ts
