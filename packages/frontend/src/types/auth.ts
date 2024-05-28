export interface RegisterData {
  email: string
  password: string
  rePassword?: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface VerifyEmail {
  otp: string
  verifyTokenHeader: string
}

export interface ForgotPassword {
  email: string
}

export interface LoginUser {
  email: string
  password: string
}

export interface ResetPassword {
  newPassword: string
  confirmPassword: string
  requestTokenHeader: string
}
