'use client'
import { useResetPasswordMutation } from '@/services/auth.service'
import { ToastService } from '@/services/toast.service'
import { ErrorResponse, ResetPasswordErrors } from '@/types/error'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

export default function ResetPassword(): React.ReactNode {
  const [resetPasswordData, setResetPasswordData] = useState<{
    newPassword: string
    confirmPassword: string
  }>({
    newPassword: '',
    confirmPassword: ''
  })
  const [resetPasswordInputError, setResetPasswordInputError] = useState<ResetPasswordErrors>({
    newPassword: '',
    confirmPassword: ''
  })
  const router = useRouter()

  const token = useSearchParams().get('token')
  useEffect(() => {
    if (!token) {
      router.push('/signin')
    }
  })

  const toastService = useMemo<ToastService>(() => new ToastService(), [])
  const onChangeInput = (value: string, type: string): void => {
    setResetPasswordData({
      ...resetPasswordData,
      [type]: value
    })
    setResetPasswordInputError({
      newPassword: '',
      confirmPassword: ''
    })
  }

  const [
    resetPassword,
    { isSuccess: isResetPassworSuccess, isError: isResetPasswordError, error: resetPasswordError }
  ] = useResetPasswordMutation()

  const handleResetPassword = (): void => {
    if (token) {
      resetPassword({
        requestTokenHeader: token,
        newPassword: resetPasswordData.newPassword,
        confirmPassword: resetPasswordData.confirmPassword
      })
    }
  }

  useEffect(() => {
    if (isResetPassworSuccess) {
      router.push('/signin')
      toastService.success('Password has been changed')
    }
    if (isResetPasswordError) {
      const errorResponse = resetPasswordError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isResetPassworSuccess, isResetPasswordError])

  const handleError = (error: ErrorResponse): void => {
    if (error?.data?.errors) {
      console.log(error.data.errors)
      setResetPasswordInputError(error.data.errors)
    }
  }

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
              <h2 className='mt-3 text-center'> Reset Password</h2>
              <div className='content-wrapper d-flex  flex-column mt-1'>
                <label className='form-label'>New Password</label>
                <div className='form-control rounded-pill'>
                  <input
                    type='password'
                    value={resetPasswordData.newPassword}
                    onChange={(e) => onChangeInput(e.target.value, 'newPassword')}
                    placeholder='Input new password'
                  ></input>
                </div>
                {resetPasswordInputError.newPassword && (
                  <span className='error-message'> {resetPasswordInputError.newPassword}</span>
                )}
                <label className='form-label'>Re-Password</label>
                <div className='form-control rounded-pill'>
                  <input
                    type='password'
                    value={resetPasswordData.confirmPassword}
                    onChange={(e) => onChangeInput(e.target.value, 'confirmPassword')}
                    placeholder='Confirm your password'
                  ></input>
                </div>
                {resetPasswordInputError.confirmPassword && (
                  <span className='error-message'> {resetPasswordInputError.confirmPassword}</span>
                )}
                <button className='btn-send-link btn btn-primary btn-lg mt-3 d-flex justify-content-center align-items-center '>
                  <div onClick={handleResetPassword} className='text-center'>
                    Reset Password
                  </div>
                </button>

                <div className='mt-5 d-flex justify-content-center align-items-center back-to-login '>
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
