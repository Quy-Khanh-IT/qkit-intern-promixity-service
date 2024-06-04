'use client'
import { useForgotPasswordMutation } from '@/services/auth.service'
import { ToastService } from '@/services/toast.service'
import { ErrorResponse } from '@/types/error'
import { decodeString } from '@/utils/jwt.utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function ResetPassword({ params }: { params: { code: string } }): React.ReactNode {
  const router = useRouter()
  const token = params.code
  const toastService = useMemo<ToastService>(() => new ToastService(), [])
  const email: string | null = decodeString(token)
  const [
    forgetPassword,
    { isSuccess: isForgetPasswordSuccess, isError: isForgetPasswordError, error: ForgotPasswordError }
  ] = useForgotPasswordMutation()

  const [resendTimer, setResendTimer] = useState<number>(0)
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setIsResendDisabled(false)
    }
    return (): void => clearInterval(interval)
  }, [resendTimer])

  const isValidEmail = (email: string | null): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return email !== null && emailRegex.test(email)
  }

  useEffect(() => {
    if (!email && !isValidEmail(email)) {
      router.push('/signin')
    }
  }, [email])

  const handleResendOTP = (): void => {
    if (email && !isResendDisabled) {
      forgetPassword({ email })
        .then(() => {
          setResendTimer(120) // Start countdown from 2 minutes
          setIsResendDisabled(true)
        })
        .catch(() => {
          toastService.error('Error to get OTP')
        })
    }
  }

  useEffect(() => {
    if (isForgetPasswordSuccess) {
      toastService.success('Email have sent to your email')
    }
    if (isForgetPasswordError) {
      const errorResponse = ForgotPasswordError as ErrorResponse
      toastService.showRestError(errorResponse)
    }
  }, [isForgetPasswordSuccess, isForgetPasswordError])

  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-full'>
            <div className='logo-wrapper'>
              <img src='/logo.png' alt='logo' />
            </div>
            <div className='reset-password-wrapper d-flex justify-content-center align-items-center flex-column'>
              <div className='icon-email-wrapper d-flex justify-content-center align-items-center'>
                <i className='fa-regular fa-envelope'></i>
              </div>
              <h2 className='mt-3 text-center'> Check your email</h2>
              <div className='content-wrapper d-flex  flex-column mt-1'>
                <div className='text-center'>We have sent password reset link to</div>
                <div className='text-center'>{email}</div>

                <div className='mt-4 text-center'>
                  Didn&apos;t receive email?{' '}
                  <strong
                    style={{
                      cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                      color: isResendDisabled ? 'gray' : '#ed1651'
                    }}
                    onClick={handleResendOTP}
                  >
                    Click to resend {isResendDisabled && `(${resendTimer}s)`}
                  </strong>
                </div>

                <div className='mt-5 d-flex justify-content-center align-items-center back-to-login'>
                  <i className='fa-solid fa-arrow-left'></i>
                  <Link href={'/signin'} className='text-center'>
                    Back to Log in
                  </Link>
                </div>

                <div className='license text-center'>© 2024 QKIT Software Company. Copyrighted.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
