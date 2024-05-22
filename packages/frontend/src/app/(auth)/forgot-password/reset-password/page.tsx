'use client'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function ResetPassword() {
  const [resetPassworData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const onChangeInput = (value: string, type: string) => {
    setResetPasswordData({
      ...resetPassworData,
      [type]: value
    })
  }

  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-full'>
            <div className='logo-wrapper'>
              <Image src='/logo.png' alt='logo' />
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
                    value={resetPassworData.newPassword}
                    onChange={(e) => onChangeInput(e.target.value, 'newPassword')}
                    placeholder='Input new password'
                  ></input>
                </div>

                <label className='form-label'>Re-Password</label>
                <div className='form-control rounded-pill'>
                  <input
                    value={resetPassworData.confirmPassword}
                    onChange={(e) => onChangeInput(e.target.value, 'confirmPassword')}
                    placeholder='Confirm your password'
                  ></input>
                </div>
                <button className='btn-send-link btn btn-primary btn-lg mt-3 d-flex justify-content-center align-items-center '>
                  <div className='text-center'>Reset Password</div>
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
