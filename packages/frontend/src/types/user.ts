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
}

export interface RoleFiltered {
  label: string
  value: string
}
