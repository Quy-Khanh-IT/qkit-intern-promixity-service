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

export interface ILoginPayload {
  email: string
  password: string
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
}
