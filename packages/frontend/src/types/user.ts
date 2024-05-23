export interface IUserInformation {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  role: string
}

export interface RoleFiltered {
  label: string
  value: string
}
