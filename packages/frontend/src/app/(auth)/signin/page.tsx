'use client'
import { useLoginUserMutation } from '@/services/auth.service'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// import * as bootstrap from "bootstrap/dist/css/bootstrap.css";

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [inputError, setInputError] = useState({
    email: '',
    password: ''
  })
  const [loginUser, { data: loginData, isSuccess, isError, isLoading, error }] = useLoginUserMutation()
  useEffect(() => {
    if (isSuccess) {
      console.log('Login successful', loginData)
    }
    if (isError) {
      console.log('Login error', error)
    }
  }, [isSuccess, isError])

  const SignIn = async () => {
    if (!password && !email) {
      setInputError({
        email: !email ? 'Please input email' : '',
        password: !password ? 'Please input email' : ''
      })
    } else {
      await loginUser({
        email,
        password
      })
    }
  }

  const onChangeData = (value: string, type: string) => {
    if (type == 'email') {
      setEmail(value)
    }
    if (type == 'password') {
      setPassword(value)
    }
    setInputError({
      email: '',
      password: ''
    })
  }
  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-left'>
            <div className='logo-wrapper'>
              <img src='/logo.png' alt='logo' />
            </div>
            <div className='form-wrapper'>
              <h2>Welcome back</h2>
              <div>Please Enter Your Detail Account</div>
              <form>
                <div className='mb-3'>
                  <label className='form-label'>Email address</label>
                  <div>
                    <span className='error-input'>{inputError.email}</span>
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
                    <span className='error-input'>{inputError.password}</span>
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
              <button style={{ color: 'white' }} onClick={SignIn} className='form-btn'>
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
              <h1>What's our </h1>
              <h1>Developer Said.</h1>
              <i className='fa-solid fa-quote-left'></i>
              <div className='quote'>
                "Amidst this vast world, map-search applications serve as gateways to explore the wonders of our planet,
                guiding us from narrow streets to towering mountains. They not only lead us to places but also instill a
                sense of wonder in the art of discovery."
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
