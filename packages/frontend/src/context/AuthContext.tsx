'use client'
import { ROUTE, StorageKey, TOAST_MSG } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { checkValidRoutes } from '@/middleware/middleware.util'
import { useLoginUserMutation } from '@/services/auth.service'
import { getMyProfile } from '@/services/user.service'
import { ILoginPayload } from '@/types/auth'
import { ChildProps, UserContextType } from '@/types/context'
import { RoleEnum } from '@/types/enum'
import { ErrorResponse } from '@/types/error'
import { IUserInformation } from '@/types/user'
import { clearCookiesFromClient, setCookieFromClient } from '@/utils/cookies.util'
import Error from 'next/error'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext<UserContextType>({} as UserContextType)

export const AuthProvider = ({ children }: ChildProps): React.ReactNode => {
  const router = useRouter()
  const [_accessToken, setAccessToken, removeAccessToken] = useLocalStorage(StorageKey._ACCESS_TOKEN, '')
  const [_refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage(StorageKey._REFRESH_TOKEN, '')
  const [userInformation, setUserInformation, removeUserInformation] = useLocalStorage(
    StorageKey._USER,
    {} as IUserInformation
  )
  const [_userId, setUserId, removeUserId] = useLocalStorage(StorageKey._USER_ID, '')
  const [_userRole, setUserRole, _removeUserRole] = useLocalStorage(StorageKey._USER_ROLE, RoleEnum._USER as string)
  const [_authSession, setAuthSession, _removeAuthSession] = useLocalStorage<boolean>(StorageKey._AUTHENTICATED, false)

  const [_routeValue, setRouteValue, removeRouteValue] = useSessionStorage(StorageKey._ROUTE_VALUE, '')

  const [login] = useLoginUserMutation()
  const presentPath = usePathname()

  const getFirstUserInformation = async (userId: string): Promise<void> => {
    try {
      const res: IUserInformation = await getMyProfile(userId)
      if (res) {
        setUserInformation(res)
        setUserId(userId)
        setUserRole(res.role as RoleEnum)
        setCookieFromClient(StorageKey._USER_ROLE, res?.role as RoleEnum)

        if (res.role === (RoleEnum._ADMIN as string)) {
          router.push(ROUTE.DASHBOARD)
          setRouteValue(ROUTE.DASHBOARD)
        } else {
          router.push(ROUTE.MAP)
          setRouteValue(ROUTE.MAP)
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const customError = err as ErrorResponse
        const errorMessage = customError.data?.message
        toast.error(errorMessage)
      } else {
        toast.error(TOAST_MSG.UNKNOWN_ERROR)
      }
    }
  }

  const fetchUserInformation = async (userId: string): Promise<void> => {
    try {
      const res: IUserInformation = await getMyProfile(userId)
      if (res) {
        setUserInformation(res)
        setUserId(userId)
        setUserRole(res.role as RoleEnum)
        setCookieFromClient(StorageKey._USER_ROLE, res?.role as RoleEnum)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const customError = err as ErrorResponse
        const errorMessage = customError.data?.message
        toast.error(errorMessage)
      } else {
        toast.error(TOAST_MSG.UNKNOWN_ERROR)
      }
    }
  }

  useEffect(() => {
    if (checkValidRoutes(presentPath) && userInformation) {
      fetchUserInformation(userInformation?.id)
    }
  }, [])

  const onLogin = async (loginPayload: ILoginPayload, stopLoading: () => void): Promise<void> => {
    await login(loginPayload)
      .unwrap()
      .then((res) => {
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        setAuthSession(true)
        setCookieFromClient(StorageKey._ACCESS_TOKEN, res.accessToken)

        getFirstUserInformation(res.userId)
      })
      .then(() => {
        toast.success(TOAST_MSG.LOGIN_SUCCESS)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const onLogout = (role: RoleEnum): void => {
    resetSession()
    if (role === RoleEnum._ADMIN) {
      router.push(ROUTE.ADMIN_LOGIN)
    } else {
      router.push(ROUTE.USER_LOGIN)
    }
    toast.success(TOAST_MSG.LOGOUT_SUCCESS)
  }

  const resetSession = (): void => {
    removeAccessToken()
    removeRefreshToken()
    setAuthSession(false)
    removeUserInformation()
    removeUserId()
    removeRouteValue()
    clearCookiesFromClient()
  }

  return (
    <AuthContext.Provider
      value={{
        onLogin,
        onLogout,
        userInformation: userInformation,
        fetchUserInformation,
        setRouteValue
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): UserContextType => React.useContext<UserContextType>(AuthContext)
