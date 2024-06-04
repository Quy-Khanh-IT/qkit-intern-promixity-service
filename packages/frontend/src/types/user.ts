export interface IUserInformation {
  id: string
  firstName: string
  lastName: string
  email: string
  image: string
  phoneNumber: string
  isVerified: boolean
  role: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  _id: Buffer
}

export interface IUpdateProfilePayload {
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface IUpdatePasswordPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface RoleFiltered {
  label: string
  value: string
}
