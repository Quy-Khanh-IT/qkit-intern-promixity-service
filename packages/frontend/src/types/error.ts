export interface ErrorResponse {
  data?: {
    errors?: {
      [key: string]: string[]
    }
    message?: string
  }
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
