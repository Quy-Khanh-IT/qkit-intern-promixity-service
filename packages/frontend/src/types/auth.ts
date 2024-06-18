export interface IRegisterUserPayload {
  email: string
  password: string
  rePassword?: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface IRegisterUserResponse {
  token: string
  message: string
}

export interface IVerifyEmailPayload {
  otp: string
  verifyTokenHeader: string
}

export interface IForgotPasswordPayload {
  email: string
}

export interface IResetPasswordPayload {
  newPassword: string
  confirmPassword: string
  requestTokenHeader: string
}

export interface ILoginPayload {
  email: string
  password: string
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  userId: string
  expiredAt: string
}

export interface ISignUpProps {
  searchParams: {
    token: string
  }
}
