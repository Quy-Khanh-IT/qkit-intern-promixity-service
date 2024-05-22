'use client'
import { useLoginUserMutation } from '@/services/auth.service'
import { ToastService } from '@/services/toast.service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ErrorResponse } from '@/types/error'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const toastService = useMemo(() => new ToastService(), [])

  const [inputError, setInputError] = useState({
    email: '',
    password: ''
  })

  const [loginUser, { isSuccess: isLoginSuccess, isError: isLoginError, error: loginError }] = useLoginUserMutation()

  const router = useRouter()

  useEffect(() => {
    if (isLoginSuccess) {
      toastService.success('Login success')
    }
    if (isLoginError) {
      const errorResponse = loginError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isLoginSuccess, isLoginError, loginError, toastService])

  const handleError = (error: ErrorResponse) => {
    if (error?.data?.errors) {
      setInputError((prevInputError) => {
        const newInputError: { email: string; password: string } = { ...prevInputError }
        const inputTypes: Array<keyof typeof newInputError> = ['email', 'password']
        for (const inputType of inputTypes) {
          if (error.data?.errors?.[inputType]) {
            newInputError[inputType] = error.data.errors[inputType][0] || ''
          } else {
            newInputError[inputType] = ''
          }
        }
        return newInputError
      })
    }
  }

  const SignIn = async () => {
    await loginUser({
      email,
      password
    })
  }

  const handleSignIn = () => {
    SignIn()
      .then(() => {})
      .catch(() => {
        toastService.error('Login failed')
      })
  }

  const onChangeData = (value: string, type: string) => {
    if (type === 'email') {
      setEmail(value)
    }
    if (type === 'password') {
      setPassword(value)
    }
    setInputError({
      email: '',
      password: ''
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      SignIn()
    }
  }

  return (
    <div className='auth-container' onKeyDown={handleKeyDown}>
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
                    <span className='error-message'> {inputError.email}</span>
                  </div>
                  <input
                    value={email}
                    onChange={(e) => onChangeData(e.target.value, 'email')}
                    type='email'
                    className='form-control'
                    placeholder='name@example.com'
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Password</label>
                  <div>
                    <span className='error-message'>{inputError.password}</span>
                  </div>
                  <input
                    value={password}
                    onChange={(e) => onChangeData(e.target.value, 'password')}
                    type='password'
                    className='form-control'
                    placeholder='********'
                  />
                </div>
              </form>
              <div className='d-flex justify-content-between'>
                <div></div>
                <div
                  data-bs-toggle='tooltip'
                  data-bs-placement='top'
                  data-bs-title='Tooltip on top'
                  style={{
                    fontSize: '14px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginBottom: '24px'
                  }}
                >
                  Forget Password
                </div>
              </div>
              <button style={{ color: 'white' }} onClick={handleSignIn} className='form-btn'>
                Sign In
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
