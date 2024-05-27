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
