'use client'

import { useForgotPasswordMutation } from '@/services/auth.service'
import { ToastService } from '@/services/toast.service'
import { ErrorResponse } from '@/types/error'
import { encodeString } from '@/utils/jwt.utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState('')
  const toastService = useMemo(() => new ToastService(), [])
  const router = useRouter()

  const [
    resetPassword,
    { isSuccess: isResetPasswordSuccess, isError: isResetPasswordError, error: resetPasswordError }
  ] = useForgotPasswordMutation()

  const handleForgotPassword = () => {
    resetPassword({ email })
  }

  useEffect(() => {
    if (isResetPasswordSuccess) {
      toastService.success('Email have sent to your email')
      const token = encodeString(email)
      console.log('token', token)
      router.push(`/forgot-password/${token}`)
    }
    if (isResetPasswordError) {
      const errorResponse = resetPasswordError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isResetPasswordSuccess, isResetPasswordError])

  const handleError = (error: ErrorResponse) => {
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
              <form>
                <div className='mb-3'>
                  <label className='form-label'>Email address</label>
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
            <div className='header'></div>
            <div className='content'>
              <h1>What&apos;s our </h1>
              <h1>Developer Said.</h1>
              <i className='fa-solid fa-quote-left'></i>
              <div className='quote'>
                &quot;Amidst this vast world, map-search applications serve as gateways to explore the wonders of our
                planet, guiding us from narrow streets to towering mountains. They not only lead us to places but also
                instill a sense of wonder in the art of discovery.;
              </div>
              <div className='quote-owner'>Trương Nguyễn Công Chính</div>
              <div style={{ marginTop: '8px' }}>Full-stack Intern at QKIT Software</div>

              <div className='btn-wrapper'>
                <button className='btn-quote'>
                  <i className='fa-solid fa-arrow-left'></i>
                </button>
                <button className='btn-quote'>
                  <i className='fa-solid fa-arrow-right'></i>
                </button>
              </div>

              <div className='thumb'>
                <img src='./images/star.png' alt='star' />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="sub-quote d-none d-xl-block">
        <div className="content"></div>
      </div> */}
    </div>
  )
}
