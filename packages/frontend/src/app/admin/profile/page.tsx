'use client'
import ChangePasswordModal from '@/app/components/admin/ChangePassword/ChangePasswordModal'
import { IModalMethods } from '@/app/components/admin/modal'
import { StorageKey } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetPrivateUserProfileQuery } from '@/services/user.service'
import type { FormInstance } from 'antd'
import { Button, Flex, Form, Input, Space, Tag, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ImageCustom from '../../components/ImageCustom/ImageCustom'
import { generateRoleColor } from '../utils/generate-color.util'
import './profile.scss'

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
  const [storedUserId, _setStoredUserId, _removeStoredUserId] = useLocalStorage(StorageKey._USER_ID, '')
  // const [userId, setUserId] = useState<string | null>(null)
  const { data: userProfile } = useGetPrivateUserProfileQuery(
    {
      userId: (storedUserId as string) || ''
    },
    { skip: !storedUserId }
  )
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [isEditInfo, setIsEditInfo] = useState<boolean>(false)
  const changePasswordModalRef = useRef<IModalMethods | null>(null)
  const [_open, _setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phoneNumber
      })
    }
  }, [userProfile])

  const onLoadingCallback = (loading: boolean): void => {
    setConfirmLoading(loading)
  }

  const onChangeEditBtn = (): void => {
    setIsEditInfo((prev) => {
      return !prev
    })
  }

  const openChangePwModal = (): void => {
    changePasswordModalRef.current?.showModal()
  }

  return (
    <>
      <Flex align='center' vertical className='--profile-wrapper scroll-bar-2'>
        <div style={{ width: '98%', maxWidth: 700 }}>
          <div className='profile-cover'>
            <Flex justify='center' style={{ marginBottom: '8px' }}>
              <div className='avatar-cover'>
                <ImageCustom width={150} height={150} src={userProfile?.image || ''} className='d-flex align-self-center'/>
                <Tag color={generateRoleColor(userProfile?.role || '')} key={userProfile?.role} className='role'>
                  {userProfile?.role.toUpperCase()}
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
                label='First name'
                rules={[{ required: true, message: 'Please enter your first name' }]}
                validateTrigger={['onBlur']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='lastName'
                label='Last name'
                rules={[{ required: true, message: 'Please enter your last name' }]}
                validateTrigger={['onBlur']}
              >
                <Input value={userProfile?.lastName} />
              </Form.Item>

              <Form.Item
                name='email'
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
            <Input defaultValue='Hello, ant design!' type='password' disabled={true} />

            <Flex justify='end' style={{ margin: '16px 0', flexGrow: 1 }}>
              <Button type='default' htmlType='reset' className={`btn-primary`} onClick={openChangePwModal}>
                Change password
              </Button>
            </Flex>
          </div>
        </div>
      </Flex>
      <ChangePasswordModal ref={changePasswordModalRef} id={''} value={''} description={''} />
    </>
  )
}

export default Profile
