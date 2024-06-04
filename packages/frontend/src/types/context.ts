import { ILoginPayload } from './auth'
import { IUserInformation } from './user'

export type ChildProps = {
  children?: React.ReactNode
}

// export type TAuthContext = {
//   authenticated: boolean
//   setAuthenticated: (_newVal: boolean) => void
// }

export type UserContextType = {
  onLogin: (_loginPayload: ILoginPayload) => void
  onLogout: () => void
  // authSession: string
  userInformation: IUserInformation
}
