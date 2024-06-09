'use client'
import { VALIDATION } from '@/constants'
import { ILoginPayload } from '@/types/auth'
import { Button, Col, Flex, Form, FormProps, Input } from 'antd'
import React, { useState } from 'react'
import './admin-sign-in.scss'
import { useAuth } from '@/context/AuthContext'
import { debounce } from 'lodash-es'

const AdminLogin: React.FC = () => {
  const { onLogin } = useAuth()
  const [form] = Form.useForm()
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false)

  const _handleLoadingLogin = (isLoading: boolean): void => {
    setLoadingLogin(isLoading)
  }

  const handleLogin: FormProps<ILoginPayload>['onFinish'] = (values) => {
    setLoadingLogin(true)
    onLogin(values, _handleLoadingLogin)
  }

  const debounceLogin = debounce((values: ILoginPayload) => handleLogin(values), 1000)

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
                form={form}
                className='login-form w-100'
                initialValues={{ remember: true }}
                layout='vertical'
                onFinish={debounceLogin}
              >
                <h3 className='title' style={{ fontWeight: 700 }}>
                  Admin Login
                </h3>
                <Form.Item name='email' label='Email' rules={VALIDATION.EMAIL} className='mb-0'>
                  <Input size='large' placeholder='user@gmail.com' className='input-email' />
                </Form.Item>

                <Form.Item name='password' label='Password' rules={VALIDATION.PASSWORD} className='mb-0 mt-2'>
                  <Input.Password
                    size='large'
                    placeholder='Password'
                    onPaste={(e) => {
                      e.preventDefault()
                      return false
                    }}
                    onCopy={(e) => {
                      e.preventDefault()
                      return false
                    }}
                  />
                </Form.Item>
                <Button htmlType='submit' loading={loadingLogin} className='login-btn w-100 mt-4'>
                  LOGIN
                </Button>
              </Form>
            </Col>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default AdminLogin
