'use client'
import { useLoginUserMutation } from '@/services/auth.service'
import { ToastService } from '@/services/toast.service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ErrorResponse } from '@/types/error'
import { saveToLocalStorage } from '@/utils/local-storage.util'
import DevQuote from '../components/DevQuote'
import './signin.scss'
import { useAuth } from '@/context/AuthContext'
import { ILoginPayload } from '@/types/auth'

const SignIn = (): React.ReactNode => {
  const { onLogin } = useAuth()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const toastService = useMemo<ToastService>(() => new ToastService(), [])
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false)

  const handleLoadingLogin = (): void => {
    setLoadingLogin(false)
  }

  const [inputError, setInputError] = useState<{
    email: string
    password: string
  }>({
    email: '',
    password: ''
  })

  const [loginUser, { data: dataLogin, isSuccess: isLoginSuccess, isError: isLoginError, error: loginError }] =
    useLoginUserMutation()

  const router = useRouter()

  useEffect(() => {
    if (isLoginSuccess) {
      toastService.success('Login success')
      saveToLocalStorage('auth', { accessToken: dataLogin.accessToken, refreshToken: dataLogin.refreshToken })
      router.push('/map')
    }
    if (isLoginError) {
      const errorResponse = loginError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isLoginSuccess, isLoginError, loginError, toastService])

  const handleError = (error: ErrorResponse): void => {
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

  const handleSignIn = (): void => {
    onLogin(
      {
        email,
        password
      } as ILoginPayload,
      handleLoadingLogin
    )
  }

  const onChangeData = (value: string, type: string): void => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
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
              <form className='fade-in'>
                <div className='mb-3'>
                  <label className='form-label'>
                    Email address <strong className='text-danger'>*</strong>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => onChangeData(e.target.value, 'email')}
                    type='email'
                    className='form-control'
                    placeholder='name@example.com'
                  />
                  {inputError.email && <span className='error-message'> {inputError.email}</span>}
                </div>
                <div className='mb-3'>
                  <label className='form-label'>
                    Password <strong className='text-danger'>*</strong>
                  </label>

                  <input
                    value={password}
                    onChange={(e) => onChangeData(e.target.value, 'password')}
                    type='password'
                    className='form-control'
                    placeholder='********'
                  />
                  {inputError.password && <span className='error-message'> {inputError.password}</span>}
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
                  onClick={() => router.push('/forgot-password')}
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
            <DevQuote />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
