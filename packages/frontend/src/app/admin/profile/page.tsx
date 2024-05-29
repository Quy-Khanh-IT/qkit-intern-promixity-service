'use client'
import { UserOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd'
import { Avatar, Button, Flex, Form, Input, Space, Tag, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import './profile.scss'
import ChangePasswordModal from '@/app/components/admin/ChangePassword/ChangePasswordModal'
import { IModalMethods } from '@/app/components/admin/modal'
import { IUserInformation } from '@/types/user'

interface SubmitButtonProps extends ProfileProps {
  form: FormInstance
  onLoadingCallback: (_loading: boolean) => void
  onChangeEditBtn: () => void
}

export interface ProfileMethods {
  handleForm: () => void
}

interface ProfileProps {
  isEditInfo: boolean
}

const EditSubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ children, isEditInfo }) => {
  const [submittable, _setSubmittable] = useState<boolean>(true)

  return (
    <Button
      type='primary'
      htmlType='submit'
      className={`${submittable && isEditInfo ? 'btn-primary' : 'btn-negative'}`}
    >
      {children}
    </Button>
  )
}

const Profile: React.FC = () => {
  const [user, _setUser] = useState<IUserInformation>()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const [isEditInfo, setIsEditInfo] = useState<boolean>(false)
  const changePwModalRef = useRef<IModalMethods | null>(null)
  const [_open, _setOpen] = useState(false)

  const onLoadingCallback = (loading: boolean): void => {
    setConfirmLoading(loading)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // async
  const fetchUser = (): void => {}

  const onChangeEditBtn = (): void => {
    setIsEditInfo((prev) => {
      return !prev
    })
  }

  const openChangePwModal = (): void => {
    changePwModalRef.current?.showModal()
  }

  return (
    <>
      <Flex align='center' vertical className='--profile-wrapper scroll-bar-2'>
        <div style={{ width: '98%', maxWidth: 700 }}>
          <div className='profile-cover'>
            <Flex justify='center' style={{ marginBottom: '8px' }}>
              <div className='avatar-cover'>
                <Avatar size={128} icon={<UserOutlined />} />
                <Tag color='green' key='ADMIN' className='role'>
                  ADMIN
                </Tag>
              </div>
            </Flex>
            <Form
              form={form}
              name='changeProfileForm'
              layout='vertical'
              autoComplete='off'
              disabled={!isEditInfo}
              className='w-100'
            >
              <Form.Item
                name='firstName'
                initialValue={user?.firstName}
                label='First name'
                rules={[{ required: true, message: 'Please enter your first name' }]}
                validateTrigger={['onBlur']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='lastName'
                initialValue={user?.lastName}
                label='Last name'
                rules={[{ required: true, message: 'Please enter your last name' }]}
                validateTrigger={['onBlur']}
              >
                <Input value={user?.lastName} />
              </Form.Item>

              <Form.Item
                name='email'
                initialValue={user?.email}
                label='Email'
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Email format is not valid' }
                ]}
                validateTrigger={['onBlur']}
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name='phone'
                initialValue={user?.phoneNumber}
                label='Phone number'
                rules={[{ required: true, message: 'Please enter your phone number' }]}
                validateTrigger={['onBlur']}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Flex justify='end'>
                  <Space>
                    <EditSubmitButton
                      form={form}
                      isEditInfo={isEditInfo}
                      onLoadingCallback={onLoadingCallback}
                      onChangeEditBtn={onChangeEditBtn}
                    >
                      Confirm
                    </EditSubmitButton>
                  </Space>
                </Flex>
              </Form.Item>
            </Form>

            <Button
              type='primary'
              htmlType='reset'
              className={`${isEditInfo ? 'btn-cancel' : 'btn-primary'} editable-btn ${confirmLoading ? 'loading' : ''}`}
              onClick={onChangeEditBtn}
            >
              {isEditInfo ? 'Cancel' : 'Update'}
            </Button>
          </div>
          <div className='password-cover'>
            <Typography.Text style={{ margin: '8px 0', display: 'block' }}>
              <span style={{ color: 'red' }}>*</span> Password
            </Typography.Text>
            <Input defaultValue='Hello, antd!' type='password' disabled={true} />

            <Flex justify='end' style={{ margin: '16px 0', flexGrow: 1 }}>
              <Button type='default' htmlType='reset' className={`btn-primary`} onClick={openChangePwModal}>
                Change password
              </Button>
            </Flex>
          </div>
        </div>
      </Flex>
      <ChangePasswordModal ref={changePwModalRef} id={''} value={''} description={''} />
    </>
  )
}

export default Profile
