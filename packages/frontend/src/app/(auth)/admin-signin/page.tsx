'use client'
import { VALIDATION } from '@/constants'
import { ILoginPayload } from '@/types/auth'
import { Col, Flex, Form, FormProps, Input } from 'antd'
import React from 'react'
import './admin-sign-in.scss'
import { useAuth } from '@/context/AuthContext'

const AdminLogin: React.FC = () => {
  const { onLogin } = useAuth()

  const handleLogin: FormProps<ILoginPayload>['onFinish'] = (values) => {
    onLogin(values)
  }

  return (
    <div className='--admin-sign-in-wrapper'>
      <div className='container'>
        <div className='design'>
          <div className='pill-1 rotate-45'></div>
          <div className='pill-2 rotate-45'></div>
          <div className='pill-3 rotate-45'></div>
          <div className='pill-4 rotate-45'></div>
        </div>

        <Flex vertical justify='center'>
          <Flex align='center' justify='center' gap='large'>
            <Col span={18} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <Form
                name='login'
                className='login-form w-100'
                initialValues={{ remember: true }}
                layout='vertical'
                onFinish={handleLogin}
              >
                <h3 className='title' style={{ fontWeight: 700 }}>
                  Admin Login
                </h3>
                <Form.Item name='email' label='Email' rules={VALIDATION.EMAIL} className='hide-required-mark'>
                  <Input size='large' autoComplete='true' placeholder='user@gmail.com' className='input-email' />
                </Form.Item>

                <Form.Item
                  name='password'
                  label='Mật khẩu'
                  className='hide-required-mark'
                  rules={VALIDATION.PASSWORD}
                  style={{ marginBottom: '0' }}
                >
                  <Input.Password size='large' autoComplete='true' placeholder='Mật khẩu' />
                </Form.Item>
                <button className='login-btn w-100 mt-4'>LOGIN</button>
              </Form>
            </Col>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default AdminLogin
