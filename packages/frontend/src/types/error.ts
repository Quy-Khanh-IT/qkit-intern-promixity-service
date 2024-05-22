export interface ErrorRespone {
  data?: {
    errors?: {
      [key: string]: string[]
    }
    message?: string
  }
}

export interface RegisterData {
  email: string
  password: string
  rePassword?: string
  firstName: string
  lastName: string
  phoneNumber: string
  city: string
  province: string
  country: string
  otp: string
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
