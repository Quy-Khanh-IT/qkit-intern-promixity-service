'use client'
import { ROUTE, StorageKey, TOAST_MSG } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { useLoginUserMutation } from '@/services/auth.service'
import { getMyProfile } from '@/services/user.service'
import { ILoginPayload, ILoginResponse } from '@/types/auth'
import { ChildProps, UserContextType } from '@/types/context'
import { RoleEnum } from '@/types/enum'
import { ErrorResponse } from '@/types/error'
import { IUserInformation } from '@/types/user'
import { clearCookiesFromClient, setCookieFromClient } from '@/utils/cookies.util'
import Error from 'next/error'
import { useRouter } from 'next/navigation'
import React, { createContext, use, useCallback, useEffect } from 'react'
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
  const [userId, setUserId, removeUserId] = useLocalStorage(StorageKey._USER_ID, '')
  const [_authSession, setAuthSession, removeAuthSession] = useLocalStorage(StorageKey._AUTHENTICATED, false)

  const [_routeValue, setRouteValue, removeRouteValue] = useSessionStorage(StorageKey._ROUTE_VALUE, '')

  const [login] = useLoginUserMutation()

  const fetchUserInformation = useCallback<(_: string) => Promise<void>>(async (userId: string): Promise<void> => {
    try {
      const res: IUserInformation = await getMyProfile(userId)
      if (res) {
        setUserInformation(res)
        setUserId(userId)
        setCookieFromClient(StorageKey._ROLE, res?.role as RoleEnum)
        setRouteValue(ROUTE.DASHBOARD)

        if (res.role === (RoleEnum._ADMIN as string)) {
          router.push(ROUTE.DASHBOARD)
        } else {
          router.push(ROUTE.ABOUT)
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const customError = err as ErrorResponse
        const errorMessage = customError.data?.message
        toast.error(errorMessage)
      } else {
        toast.error('An unknown error occurred')
      }
    }
  }, [])

  useEffect(() => {
    if ((userInformation as IUserInformation).id) {
      fetchUserInformation((userInformation as IUserInformation).id)
    }
  }, [fetchUserInformation])

  const onLogin = async (loginPayload: ILoginPayload): Promise<void> => {
    await login(loginPayload)
      .unwrap()
      .then((res) => {
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        setAuthSession(true)
        setCookieFromClient(StorageKey._ACCESS_TOKEN, res.accessToken)

        fetchUserInformation(res.userId)
      })
      .then(() => {
        setTimeout(() => {
          toast.success(TOAST_MSG.LOGIN_SUCCESS)
        }, 1000)
      })
  }

  const onLogout = (): void => {
    resetSession()
    router.push(ROUTE.ROOT)
    window.location.reload()
  }

  const resetSession = (): void => {
    removeAccessToken()
    removeRefreshToken()
    removeAuthSession()
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
        userId: userId as string,
        userInformation: userInformation as IUserInformation,
        fetchUserInformation
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): UserContextType => React.useContext<UserContextType>(AuthContext)
