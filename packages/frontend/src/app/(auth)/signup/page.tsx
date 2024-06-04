'use client'
import { useRegisterUserMutation, useVerifyEmailMutation } from '@/services/auth.service'
import { useRegistrationOTPMutation } from '@/services/otp.service'
import { ToastService } from '@/services/toast.service'
import { IRegisterUserPayload, IVerifyEmailPayload, ISignUpProps } from '@/types/auth'
import { ErrorResponse, RegisterDataErrors } from '@/types/error'
import { GetProp, Input } from 'antd'
import { OTPProps } from 'antd/es/input/OTP'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import './signup.scss'

export default function SignUp({ searchParams: { token } }: ISignUpProps): React.ReactNode {
  useEffect(() => {
    if (token) {
      setIsGetOTP(true)
      setVerifyEmailData((prevData) => ({
        ...prevData,
        verifyTokenHeader: token
      }))
    }
  }, [])

  const [registerData, setRegisterData] = useState<IRegisterUserPayload>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  })

  const [registerDataErrors, setRegisterDataErrors] = useState<RegisterDataErrors>({})

  const [verifyEmailData, setVerifyEmailData] = useState<IVerifyEmailPayload>({
    otp: '',
    verifyTokenHeader: ''
  })

  const [isGetOTP, setIsGetOTP] = useState<boolean>(false)
  const toastService = useMemo<ToastService>(() => new ToastService(), [])
  const router = useRouter()

  const [registrationOTP, { isSuccess: isOTPSuccess, isError: isOTPError, error: otpError }] =
    useRegistrationOTPMutation()

  const [
    registerUser,
    { data: userData, isSuccess: isRegisterSuccess, isError: isRegisterError, error: registerError }
  ] = useRegisterUserMutation()

  const [verifyEmail, { isSuccess: isVerifySuccess, isError: isVerifyError, error: verifyError }] =
    useVerifyEmailMutation()

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

  const SignUp = async (): Promise<void> => {
    if (registerData.password !== registerData.rePassword) {
      toast.error('Password and re-password do not match')
      setRegisterDataErrors((prevData) => ({
        ...prevData,
        rePassword: 'Password and re-password do not match',
        password: 'Password and re-password do not match'
      }))
      return
    }

    await registerUser(registerData)
  }

  const handleSignUp = (): void => {
    SignUp()
      .then(() => {})
      .catch(() => {
        toastService.error('Error to register')
      })
  }

  const GetOTP = async (): Promise<void> => {
    if (!registerData.email) {
      toastService.error('Please input email')
      return
    }

    await registrationOTP({
      email: registerData.email
    })
  }

  const handleGetOTP = (): void => {
    if (!isResendDisabled) {
      GetOTP()
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
    if (isOTPSuccess) {
      toastService.success('OTP sent to your email')
    }
    if (isOTPError) {
      const errorResponse = otpError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
  }, [isOTPSuccess, isOTPError])

  useEffect(() => {
    if (isRegisterSuccess) {
      toastService.success('Registered successfully')

      setVerifyEmailData((prevData) => ({
        ...prevData,
        verifyTokenHeader: userData.token
      }))
      setIsGetOTP(true)
    }
    if (isRegisterError) {
      const errorResponse = registerError as ErrorResponse
      handleError(errorResponse)
      toastService.showRestError(errorResponse)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegisterSuccess, isRegisterError])

  const handleError = (error: ErrorResponse): void => {
    if (error?.data?.errors) {
      setRegisterDataErrors((prevInputError) => {
        const newInputError: RegisterDataErrors = { ...prevInputError }
        const inputTypes: Array<keyof typeof newInputError> = [
          'email',
          'password',
          'firstName',
          'lastName',
          'phoneNumber',
          'city',
          'province',
          'country',
          'otp'
        ]
        inputTypes.forEach((type) => {
          if (error?.data?.errors && Array.isArray(error.data.errors[type]) && error.data.errors[type].length > 0) {
            newInputError[type] = error.data.errors[type][0]
          }
        })

        return newInputError
      })
    }
  }

  const onChangeRegisterData = (value: string, type: keyof IRegisterUserPayload): void => {
    setRegisterData({
      ...registerData,
      [type]: value
    })

    setRegisterDataErrors({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      otp: ''
    })
  }

  const redirectHome = (): void => {
    router.push('/')
  }

  const onChange: GetProp<typeof Input.OTP, 'onChange'> = (text) => {
    setVerifyEmailData({
      ...verifyEmailData,
      otp: text
    })
  }

  const sharedProps: OTPProps = {
    onChange
  }

  const handleConfirm = (): void => {
    verifyEmail(verifyEmailData)
  }

  useEffect(() => {
    if (isVerifySuccess) {
      toastService.success('Email verified')
      router.push('/signin')
    }
    if (isVerifyError) {
      const errorResponse = verifyError as ErrorResponse
      toastService.showRestError(errorResponse)
    }
  }, [isVerifySuccess, isVerifyError])

  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-full'>
            <div className='logo-wrapper'>
              <img onClick={redirectHome} src='/logo.png' alt='logo' />
            </div>
            <div className='form-wrapper f-form'>
              <div className='header-title'>
                <h2>Welcome to Proximity Service</h2>
                <div>Please Enter Information To Join With Us</div>
              </div>
              <div className={`container ${!isGetOTP && 'fade-in'}`}>
                {!isGetOTP ? (
                  <div className='row'>
                    <div className='col-12 col-md-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>
                            Email address<strong className='text-danger'>*</strong>
                          </label>

                          <input
                            value={registerData.email}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'email')}
                            type='email'
                            className={`form-control ${registerDataErrors.email ? 'error-input' : ''}`}
                            placeholder='name@example.com'
                          />
                          {registerDataErrors.email && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.email}</span>
                            </div>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>
                            Passwords <strong className='text-danger'>*</strong>
                          </label>

                          <input
                            value={registerData.password}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'password')}
                            type='password'
                            className={`form-control ${registerDataErrors.password ? 'error-input' : ''}`}
                            placeholder='********'
                          />
                          {registerDataErrors.password && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.password}</span>
                            </div>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>
                            Re-Passwords <strong className='text-danger'>*</strong>
                          </label>

                          <input
                            value={registerData.rePassword || ''}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'rePassword')}
                            type='password'
                            className={`form-control ${registerDataErrors.rePassword ? 'error-input' : ''}`}
                            placeholder='********'
                          />
                          {registerDataErrors.rePassword && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.rePassword}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='col-12 col-md-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>
                            First names <strong className='text-danger'>*</strong>
                          </label>

                          <input
                            type='text'
                            className={`form-control ${registerDataErrors.firstName ? 'error-input' : ''}`}
                            placeholder='Chinh'
                            value={registerData.firstName}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'firstName')}
                          />
                          {registerDataErrors.firstName && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.firstName}</span>
                            </div>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>
                            Last names <strong className='text-danger'>*</strong>
                          </label>

                          <input
                            type='text'
                            className={`form-control ${registerDataErrors.lastName ? 'error-input' : ''}`}
                            placeholder='Truong Nguyen Cong'
                            value={registerData.lastName}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'lastName')}
                          />
                          {registerDataErrors.lastName && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.lastName}</span>
                            </div>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>
                            Phone Numbers <strong className='text-danger'>*</strong>
                          </label>

                          <input
                            type='text'
                            className={`form-control ${registerDataErrors.phoneNumber ? 'error-input' : ''}`}
                            placeholder='0123456789'
                            value={registerData.phoneNumber}
                            onChange={(e) => onChangeRegisterData(e.target.value, 'phoneNumber')}
                          />
                          {registerDataErrors.phoneNumber && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='row mt-5'>
                    <div className='col-12'>
                      <div className='form'>
                        <div className='mb-3 d-flex align-items-center justify-content-center flex-column'>
                          <label className='form-label mb-4 text-center'>
                            The confirmation code has been sent to your email. Includes 6 digits. Please enter here to
                            confirm your account. s <strong className='text-danger'>*</strong>
                          </label>

                          <div className='mb-4'>
                            <Input.OTP mask='🔒' {...sharedProps} />
                          </div>

                          {registerDataErrors.otp && (
                            <div>
                              <span className='error-message mb-2'> {registerDataErrors.otp}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{ padding: '0 72px', flexDirection: 'column' }}
            >
              {!isGetOTP ? (
                <button style={{ width: '200px' }} onClick={handleSignUp} className='form-btn mt-3'>
                  Register
                </button>
              ) : (
                <div className='d-flex align-items-center justify-content-center flex-column'>
                  <button style={{ width: '200px' }} onClick={handleConfirm} className='form-btn'>
                    Confirm
                  </button>
                  {registerData.email ? (
                    <span className='text-center mt-2 note-text'>
                      Haven&apos;t received the mail yet?{' '}
                      <strong
                        onClick={handleGetOTP}
                        style={{
                          cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                          color: isResendDisabled ? 'gray' : '#ed1651'
                        }}
                      >
                        Resend here {isResendDisabled && `(${resendTimer}s)`}
                      </strong>
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                Already have an account?{' '}
                <strong style={{ cursor: 'pointer' }}>
                  <Link
                    style={{
                      textDecoration: 'none',
                      color: '#ed1651',
                      fontWeight: '300'
                    }}
                    href='/signin'
                  >
                    Login here
                  </Link>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
