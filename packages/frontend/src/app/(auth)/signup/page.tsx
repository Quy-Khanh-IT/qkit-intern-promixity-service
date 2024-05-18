'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from '../../../services/axiosInstance'
import Link from 'next/link'
import { useRegistrationOTPMutation } from '@/services/otp.service'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cities, setCities] = useState([])
  const [provinces, setProvinces] = useState([])

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')

  const [isGetOTP, setIsGetOTP] = useState(true)

  const [registrationOTP, { data: otpData, isSuccess, isError, isLoading, error }] = useRegistrationOTPMutation()
  const getCode = async () => {
    if (!email) {
      toast.error('Please input email')
    } else {
      await registrationOTP({
        email
      })

      if (isSuccess) {
        toast.success('Email sent successfully')
      }
    }
  }

  const fetchProvinces = async () => {
    const response = await fetch('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100')
    const listCity = await response.json()
    setCities(listCity.results)
  }

  useEffect(() => {
    fetchProvinces()
  }, [])

  const fetchProvince = async () => {
    const response = await fetch(`https://vnprovinces.pythonanywhere.com//api/provinces/${selectedCity}`)
    const listCity = await response.json()
    setProvinces(listCity.districts)
  }

  useEffect(() => {
    if (selectedCity === '') return
    else {
      fetchProvince()
    }
  }, [selectedCity])

  const SignIn = () => {
    toast(`${email} ${password}`)
  }

  const GetOTP = () => {
    setIsGetOTP(false)
  }
  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <div className='content-wrapper'>
          <div className='content-full'>
            <div className='logo-wrapper'>
              <img src='/logo.png' alt='logo' />
            </div>
            <div className='form-wrapper f-form'>
              <h2>Welcome to Proximity Service</h2>
              <div>Please Enter Information To Join With Us</div>
              <div className={`container ${!isGetOTP && 'fade-in'}`}>
                {isGetOTP ? (
                  <div className='row mt-5'>
                    <div className='col-3' />
                    <div className='col-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>Email address</label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            className='form-control'
                            placeholder='name@example.com'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-3' />
                  </div>
                ) : (
                  <div className='row'>
                    <div className='col-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>OTP</label>

                          <div className='form-control'>
                            <input placeholder='Input OTP code with 6 digits'></input>
                          </div>
                        </div>

                        <div className='mb-3'>
                          <label className='form-label'>Password</label>
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            className='form-control'
                            placeholder='********'
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Re-Password</label>
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            className='form-control'
                            placeholder='********'
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Phone Number</label>
                          <input type='text' className='form-control' placeholder='0123456789' />
                        </div>
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='form'>
                        <div className='mb-3'>
                          <label className='form-label'>First name</label>
                          <input type='text' className='form-control' placeholder='Chinh' />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Last name</label>
                          <input type='text' className='form-control' placeholder='Truong Nguyen Cong' />
                        </div>

                        <div className='mb-3 '>
                          <div className='mb-3'>
                            <label className='form-label'>Province</label>
                            <select
                              value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)}
                              className='form-control'
                            >
                              <option value={''}>--Choose Province--</option>
                              {cities && cities.length > 0
                                ? cities.map((city: any) => (
                                    <option key={city.id} value={city.id}>
                                      {city.name}
                                    </option>
                                  ))
                                : ''}
                            </select>
                          </div>
                        </div>

                        <div className='mb-3'>
                          <label className='form-label'>District</label>
                          <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className='form-control'
                          >
                            <option value={''}>--Choose District--</option>
                            {provinces && provinces.length > 0
                              ? provinces.map((province: any) => (
                                  <option key={province.id} value={province.id}>
                                    {province.name}
                                  </option>
                                ))
                              : ''}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className='d-flex  align-items-center justify-content-center'
              style={{ padding: '0 72x', flexDirection: 'column' }}
            >
              {isGetOTP ? (
                <button style={{ width: '200px' }} onClick={GetOTP} className='form-btn mt-3'>
                  Get OTP
                </button>
              ) : (
                <button style={{ width: '200px' }} onClick={SignIn} className='form-btn'>
                  Sign Up
                </button>
              )}

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                {' '}
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
