import Link from 'next/link'
import { Image } from 'antd'

export default function ResetPassword() {
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
              <h2 className='mt-3 text-center'> Check your email</h2>
              <div className='content-wrapper d-flex  flex-column mt-1'>
                <div className='text-center'>We have sent password reset link to</div>
                <div className='text-center'>test1239090@gmail.com</div>

                <div className='mt-4 text-center'>
                  Didn't receive email? <strong>Click to resend</strong>
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
