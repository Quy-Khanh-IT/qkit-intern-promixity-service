'use client'
import { ROUTE, StorageKey, TOAST_MSG } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLoginUserMutation } from '@/services/auth.service'
import { getMyProfile } from '@/services/user.service'
import { ILoginPayload, ILoginResponse } from '@/types/auth'
import { ChildProps, UserContextType } from '@/types/context'
import { RoleEnum } from '@/types/enum'
import { ErrorResponse } from '@/types/error'
import { IUserInformation } from '@/types/user'
import { setCookieFromClient } from '@/utils/cookies.util'
import { saveToLocalStorage } from '@/utils/storage.util'
import Error from 'next/error'
import { useRouter } from 'next/navigation'
import React, { createContext, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext<UserContextType>({} as UserContextType)

export const AuthProvider = ({ children }: ChildProps): React.ReactNode => {
  const router = useRouter()
  const [_accessToken, setAccessToken] = useLocalStorage(StorageKey._ACCESS_TOKEN, '')
  const [_refreshToken, setRefreshToken] = useLocalStorage(StorageKey._REFRESH_TOKEN, '')
  const [userInformation, setUserInformation] = useLocalStorage(StorageKey._USER, {} as IUserInformation)
  const [_authSession, setAuthSession] = useLocalStorage(StorageKey._AUTHENTICATED, false)
  const userId = useRef<string>('')
  const [login] = useLoginUserMutation()

  const fetchUserInformation = useCallback<(_: Omit<ILoginResponse, 'refreshToken'>) => Promise<void>>(
    async (response: Omit<ILoginResponse, 'refreshToken'>): Promise<void> => {
      try {
        const res: IUserInformation = await getMyProfile(response.userId)
        if (res) {
          setUserInformation(res)
          setCookieFromClient(StorageKey._ACCESS_TOKEN, response.accessToken)
          setCookieFromClient(StorageKey._ROLE, res?.role as RoleEnum)
          saveToLocalStorage(StorageKey._ROUTE_VALUE, ROUTE.DASHBOARD)

          if (res.role === (RoleEnum._ADMIN as string)) {
            router.push(ROUTE.DASHBOARD)
          } else {
            router.push(ROUTE.ABOUT)
          }
          setTimeout(() => {
            toast.success(TOAST_MSG.LOGIN_SUCCESS)
          }, 1000)
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
    },
    []
  )

  const onLogin = async (loginPayload: ILoginPayload): Promise<void> => {
    await login(loginPayload)
      .unwrap()
      .then((res) => {
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        setAuthSession(true)
        userId.current = res.userId

        fetchUserInformation(res)
      })
  }

  const logout = (): void => {
    router.push(ROUTE.ROOT)
  }

  return (
    <AuthContext.Provider value={{ onLogin, logout, userInformation: userInformation as IUserInformation }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): UserContextType => React.useContext<UserContextType>(AuthContext)
