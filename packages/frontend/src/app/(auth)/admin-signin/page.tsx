'use client'
import { VALIDATION } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { ILoginPayload } from '@/types/auth'
import { Button, Col, Flex, Form, Input } from 'antd'
import { debounce } from 'lodash-es'
import React, { useState } from 'react'
import './admin-sign-in.scss'

const AdminLogin: React.FC = () => {
  const { onLogin } = useAuth()
  const [form] = Form.useForm<ILoginPayload>()
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false)
  const [disableLogin, setDisableLogin] = useState<boolean>(false)

  const _stopLoadingLogin = (): void => {
    setLoadingLogin(false)
    setTimeout(() => {
      setDisableLogin(false)
    }, 10000)
  }

  const debounceLoginForm = debounce((values: ILoginPayload) => {
    onLogin(values, _stopLoadingLogin)
  }, 1000)

  const onFinishForm = (values: ILoginPayload): void => {
    setLoadingLogin(true)
    setDisableLogin(true)
    debounceLoginForm(values)
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
                form={form}
                className='login-form w-100'
                initialValues={{ remember: true }}
                layout='vertical'
                onFinish={onFinishForm}
              >
                <h3 className='title' style={{ fontWeight: 700 }}>
                  Admin Login
                </h3>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={VALIDATION.EMAIL}
                  className='mb-0'
                  validateTrigger={['onBlur']}
                >
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
                <Button
                  htmlType='submit'
                  loading={loadingLogin}
                  disabled={disableLogin}
                  className='login-btn w-100 mt-4'
                >
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
