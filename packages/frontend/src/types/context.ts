import { ILoginPayload } from './auth'
import { IUserInformation } from './user'

export type ChildProps = {
  children?: React.ReactNode
}

export type UserContextType = {
  onLogin: (_loginPayload: ILoginPayload) => void
  onLogout: () => void
  fetchUserInformation: (_userId: string) => Promise<void>
  userId: string
  userInformation: IUserInformation
  setRouteValue: (_value: string) => void
}
