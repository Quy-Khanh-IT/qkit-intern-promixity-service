'use client'
import { LOCAL_ENDPOINT, ROUTE, StorageKey, TOAST_MSG } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { checkValidRoutes } from '@/middleware/middleware.util'
import { useLoginUserMutation, useRefreshTokenMutation } from '@/services/auth.service'
import { getMyProfile } from '@/services/user.service'
import { ILoginPayload, ILoginResponse } from '@/types/auth'
import { ChildProps, UserContextType } from '@/types/context'
import { RoleEnum } from '@/types/enum'
import { ErrorResponse } from '@/types/error'
import { IUserInformation } from '@/types/user'
import { clearCookiesFromClient, setCookieFromClient } from '@/utils/cookies.util'
import { getTimeUntilExpiry } from '@/utils/helpers.util'
import Error from 'next/error'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useEffect } from 'react'
import { toast } from 'react-toastify'

const TIME_GET_REFRESH_TOKEN = 10 * 60 * 1000
const AuthContext = createContext<UserContextType>({} as UserContextType)

export const AuthProvider = ({ children }: ChildProps): React.ReactNode => {
  const router = useRouter()
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage(StorageKey._ACCESS_TOKEN, '')
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage(StorageKey._REFRESH_TOKEN, '')
  const [expiredTime, setExpiredTime, removeExpiredTime] = useLocalStorage(StorageKey._EXPIRED_TIME, '')
  const [userInformation, setUserInformation, removeUserInformation] = useLocalStorage(
    StorageKey._USER,
    {} as IUserInformation
  )
  const [_userId, setUserId, removeUserId] = useLocalStorage(StorageKey._USER_ID, '')
  const [_userRole, setUserRole, _removeUserRole] = useLocalStorage(StorageKey._USER_ROLE, RoleEnum._USER as string)
  const [_authSession, setAuthSession, _removeAuthSession] = useLocalStorage<boolean>(StorageKey._AUTHENTICATED, false)

  const [_routeValue, setRouteValue, removeRouteValue] = useSessionStorage(StorageKey._ROUTE_VALUE, '')

  const [login] = useLoginUserMutation()
  const [refreshTokenAPI] = useRefreshTokenMutation()
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

  const fetchRefreshToken = async (): Promise<void> => {
    await refreshTokenAPI(refreshToken)
      .unwrap()
      .then((res) => {
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        setCookieFromClient(StorageKey._ACCESS_TOKEN, res.accessToken)
        setExpiredTime(res.expiredAt)
      })
  }

  useEffect(() => {
    if (checkValidRoutes(presentPath) && userInformation) {
      fetchUserInformation(userInformation?.id)
    }
  }, [])

  useEffect(() => {
    const checkTokenValid = (): number => {
      const remainingTime = getTimeUntilExpiry(new Date(expiredTime).getTime())
      if (accessToken) {
        if (remainingTime > TIME_GET_REFRESH_TOKEN) {
          setTimeout(fetchRefreshToken, remainingTime - TIME_GET_REFRESH_TOKEN)
        } else {
          resetStorage()
          window.location.href = LOCAL_ENDPOINT + ROUTE.ROOT
          setRouteValue(ROUTE.ROOT)
          toast.info(TOAST_MSG.SESSION_EXPIRED)
        }
      }
      return remainingTime
    }

    const setTokenValidityCheck = (time: number): NodeJS.Timeout | null => {
      if (time > 0) {
        const timeoutId = setTimeout(() => {
          const newRemainingTime = checkTokenValid()
          setTokenValidityCheck(newRemainingTime)
        }, time)
        return timeoutId
      }
      return null
    }

    const initialRemainingTime = checkTokenValid()
    const initialTimeoutId = setTokenValidityCheck(initialRemainingTime)

    return (): void => {
      if (initialTimeoutId) {
        clearTimeout(initialTimeoutId)
      }
    }
  }, [])

  const initStorage = (res: ILoginResponse): void => {
    setAccessToken(res.accessToken)
    setRefreshToken(res.refreshToken)
    setExpiredTime(res.expiredAt)
    setAuthSession(true)
    setCookieFromClient(StorageKey._ACCESS_TOKEN, res.accessToken)

    getFirstUserInformation(res.userId)
  }

  const onLogin = async (loginPayload: ILoginPayload, stopLoading: () => void): Promise<void> => {
    await login(loginPayload)
      .unwrap()
      .then((res) => {
        initStorage(res)
      })
      .then(() => {
        toast.success(TOAST_MSG.LOGIN_SUCCESS)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const onLogout = (role: RoleEnum): void => {
    resetStorage()
    if (role === RoleEnum._ADMIN) {
      router.push(ROUTE.ADMIN_LOGIN)
    } else {
      router.push(ROUTE.USER_LOGIN)
    }
    toast.success(TOAST_MSG.LOGOUT_SUCCESS)
  }

  const resetStorage = (): void => {
    removeAccessToken()
    removeRefreshToken()
    setAuthSession(false)
    removeExpiredTime()
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
