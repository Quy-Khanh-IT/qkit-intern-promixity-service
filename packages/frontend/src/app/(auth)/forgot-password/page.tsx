'use client'

import { useForgotPasswordMutation } from '@/services/auth.service'
import { ToastService } from '@/services/toast.service'
import { ErrorResponse } from '@/types/error'
import { encodeString } from '@/utils/jwt.utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import DevQuote from '../components/DevQuote'

export default function ForgotPassword(): React.ReactNode {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const toastService = useMemo<ToastService>(() => new ToastService(), [])
  const router = useRouter()

  const [
    resetPassword,
    { isSuccess: isResetPasswordSuccess, isError: isResetPasswordError, error: resetPasswordError }
  ] = useForgotPasswordMutation()

  const handleForgotPassword = (): void => {
    resetPassword({ email })
  }

  useEffect(() => {
    if (isResetPasswordSuccess) {
      toastService.success('Email have sent to your email')
      const token = encodeString(email)
      router.push(`/forgot-password/${token}`)
    }
    if (isResetPasswordError) {
      const errorResponse = resetPasswordError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isResetPasswordSuccess, isResetPasswordError])

  const handleError = (error: ErrorResponse): void => {
    if (error?.data?.errors) {
      setEmailError(error.data.errors?.email?.[0] || '')
    }
  }
  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-left'>
            <div className='logo-wrapper'>
              <img onClick={() => router.push('/')} src='/logo.png' alt='logo' width={100} height={100} />
            </div>
            <div className='form-wrapper'>
              <h2>Welcome back</h2>
              <div>Please Enter Your Detail Account</div>
              <form className='fade-in'>
                <div className='mb-3'>
                  <label className='form-label'>
                    Email address
                    <strong className='text-danger'>*</strong>
                  </label>
                  <div>
                    <span className='error-message'> {emailError}</span>
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    className='form-control'
                    placeholder='name@example.com'
                  />
                </div>
              </form>

              <button style={{ color: 'white' }} onClick={handleForgotPassword} className='form-btn mt-3'>
                GET OTP
              </button>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                {' '}
                Do not have an account?{' '}
                <strong style={{ cursor: 'pointer' }}>
                  <Link
                    style={{
                      textDecoration: 'none',
                      color: '#ed1651',
                      fontWeight: '300'
                    }}
                    href='/signup'
                  >
                    Register here!
                  </Link>
                </strong>
              </div>
            </div>
          </div>
          <div className='content-right d-none d-xl-block'>
            <DevQuote />
          </div>
        </div>
      </div>
      {/* <div className="sub-quote d-none d-xl-block">
        <div className="content"></div>
      </div> */}
    </div>
  )
}
