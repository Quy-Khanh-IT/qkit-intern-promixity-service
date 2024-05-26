/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { createContext, useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

import { ROUTE, StorageKey } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLoginUserMutation } from '@/services/auth.service'
// import { getMyProfile } from '@/services/user.service'
import { ILoginPayload } from '@/types/auth'
import { ChildProps, UserContextType } from '@/types/context'
import { IUserInformation } from '@/types/user'
// import { getTimeUntilExpiry } from '@/utils'
// import JWTManager from '@/utils/jwt.util'
import { useRouter } from 'next/navigation'

const AuthContext = createContext<UserContextType>({} as UserContextType)

const TIME_GET_REFRESH_TOKEN = 10 * 60 * 1000

export const AuthProvider = ({ children }: ChildProps) => {
  const router = useRouter()
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage(StorageKey._ACCESS_TOKEN, '')
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage(StorageKey._REFRESH_TOKEN, '')
  const [userInformation, setUserInformation, removeUserInformation] = useLocalStorage(
    StorageKey._USER,
    {} as IUserInformation
  )

  const [authSession, setAuthSession, removeAuthSession] = useLocalStorage(StorageKey._AUTHENTICATED, false)
  // const decodedToken = useRef({} as IJwtPayloadCustomize)

  const [login] = useLoginUserMutation()
  // const [refreshTokenAPI] = useRefreshTokenMutation()

  const fetchUserInformation = useCallback(async (): Promise<void> => {
    // try {
    //   const res: IUserInformation = await getMyProfile()
    //   if (res) setUserInformation(res)
    // } catch (err: any) {
    //   // toast.error(err.response.data.message)
    // }
  }, [])

  // const fetchRefreshToken = async (): Promise<void> => {
  //   await refreshTokenAPI(refreshToken)
  //     .unwrap()
  //     .then((res) => {
  //       setAccessToken(res.accessToken)
  //       setRefreshToken(res.refreshToken)
  //       setExpiredTime(res.expiredTime)
  //       decodedToken.current = JWTManager.decodedToken(res.accessToken)
  //     })
  //     .catch(() => {
  //       resetSession()
  //       router.push(ROUTE.ROOT)
  //       toast.info(TOAST_MESSAGE.SESSION_EXPIRED)
  //     })
  // }

  useEffect(() => {
    if (authSession) {
      fetchUserInformation()
    }
  }, [authSession, fetchUserInformation])

  // useEffect(() => {
  //   const checkTokenValid = () => {
  //     const remainingTime = getTimeUntilExpiry(expiredTime)
  //     if (accessToken) {
  //       if (remainingTime > TIME_GET_REFRESH_TOKEN) {
  //         setTimeout(fetchRefreshToken, remainingTime - TIME_GET_REFRESH_TOKEN)
  //       } else {
  //         resetSession()
  //         navigate(ROUTE.ROOT)
  //         toast.info(TOAST_MESSAGE.SESSION_EXPIRED)
  //       }
  //     }
  //     return remainingTime
  //   }

  //   const setTokenValidityCheck = (time: number) => {
  //     if (time > 0) {
  //       const timeoutId = setTimeout(() => {
  //         const newRemainingTime = checkTokenValid()
  //         setTokenValidityCheck(newRemainingTime)
  //       }, time)
  //       return timeoutId
  //     }
  //     return null
  //   }

  //   const initialRemainingTime = checkTokenValid()
  //   const initialTimeoutId = setTokenValidityCheck(initialRemainingTime)

  //   return () => {
  //     if (initialTimeoutId) {
  //       clearTimeout(initialTimeoutId)
  //     }
  //   }
  // }, [accessToken, refreshToken])

  const onLogin = async (loginPayload: ILoginPayload): Promise<void> => {
    console.log('da vao onLogin');
    await login(loginPayload)
      .unwrap()
      .then((res) => {
        setAccessToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        setAuthSession(true)
        // decodedToken.current = JWTManager.decodedToken(res.accessToken)
        // return fetchUserInformation()
        console.log('login success')
        // return Promise<void>
      })
      .then(() => {
        router.push(ROUTE.MANAGE_USER)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const logout = (): void => {
    // resetSession()
    router.push(ROUTE.ROOT)
  }

  const resetSession = (): void => {
    removeAccessToken()
    removeRefreshToken()
    removeAuthSession()
    removeUserInformation()
    setAuthSession(false)
  }

  return (
    <AuthContext.Provider value={{ onLogin, logout, userInformation: userInformation as IUserInformation }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): UserContextType => React.useContext(AuthContext)
