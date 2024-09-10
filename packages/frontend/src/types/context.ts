import { ILoginPayload } from './auth'
import { RoleEnum } from './enum'
import { IUserInformation } from './user'

export type ChildProps = {
  children?: React.ReactNode
}

export type UserContextType = {
  onLogin: (_loginPayload: ILoginPayload, _stopLoading: () => void) => void
  onLogout: (_role: RoleEnum) => void
  fetchUserInformation: (_userId: string) => Promise<void>
  userInformation: IUserInformation
  setRouteValue: (_value: string) => void
}
