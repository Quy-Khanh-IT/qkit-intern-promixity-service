export interface IRegisterUser {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  city: string
  province: string
  country: string
  otp: string
}

export interface ILoginPayload {
  email: string
  password: string
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
}
