'use client'
import React, { createContext, useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { ROUTE, StorageKey } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLoginUserMutation } from '@/services/auth.service'
import { ILoginPayload } from '@/types/auth'
import { ChildProps, UserContextType } from '@/types/context'
import { RoleEnum } from '@/types/enum'
import { IUserInformation } from '@/types/user'
import { setCookieFromClient } from '@/utils/cookies.util'
import { useRouter } from 'next/navigation'
import { TOAST_MSG } from '../constants/common'
import { useGetProfileQuery } from '@/services/user.service'

const AuthContext = createContext<UserContextType>({} as UserContextType)

export const AuthProvider = ({ children }: ChildProps): React.ReactNode => {
  const router = useRouter()
  const [accessToken, setAccessToken] = useLocalStorage(StorageKey._ACCESS_TOKEN, '')
  const [_refreshToken, setRefreshToken] = useLocalStorage(StorageKey._REFRESH_TOKEN, '')
  const [userInformation, setUserInformation] = useLocalStorage(StorageKey._USER, {} as IUserInformation)
  const [_authSession, setAuthSession, _] = useLocalStorage(StorageKey._AUTHENTICATED, false)
  const userId = useRef<string>('')
  const { data: userData } = useGetProfileQuery(userId.current, { skip: !userId.current })
  const [login] = useLoginUserMutation()

  const fetchUserInformation = useCallback(() => {
    setCookieFromClient(StorageKey._ACCESS_TOKEN, accessToken as string)
    setCookieFromClient(StorageKey._USER, userData?.role as RoleEnum)
  }, [])

  useEffect(() => {
    if (userData) {
      setUserInformation(userData)
      setTimeout(() => {
        fetchUserInformation()
      }, 1000)
    }
  }, [userData])

  const onLogin = async (loginPayload: ILoginPayload): Promise<void> => {
    await login(loginPayload)
      .unwrap()
      .then((res) => {
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        setAuthSession(true)
        userId.current = res.userId

        // fetchUserInformation()
        setCookieFromClient(StorageKey._ACCESS_TOKEN, res.accessToken)
        setCookieFromClient(StorageKey._USER, userData?.role as RoleEnum)
      })
      .then(() => {
        toast.success(TOAST_MSG.LOGIN_SUCCESS)
        router.push(ROUTE.MANAGE_USER)
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

export const useAuth = (): UserContextType => React.useContext(AuthContext)
