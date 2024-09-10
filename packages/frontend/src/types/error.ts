export interface ErrorResponse {
  data?: {
    errors?: ErrorDataResponse
    message?: string
    statusCode?: number
  }
  status?: number
}

export interface ErrorDataResponse {
  [key: string]: string[]
}

export interface RegisterDataErrors {
  email?: string
  password?: string
  rePassword?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  city?: string
  province?: string
  country?: string
  otp?: string
}

export interface ResetPasswordErrors {
  newPassword?: string
  confirmPassword?: string
}
