'use client'
import ChangePasswordModal from '@/app/components/admin/ConfirmModal/ConfirmModal'
import { IModalMethods } from '@/types/modal'
import { useAuth } from '@/context/AuthContext'
import { useGetPrivateUserProfileQuery, useUpdatePrivateUserProfileMutation } from '@/services/user.service'
import type { FormInstance, UploadFile } from 'antd'
import { Button, Flex, Form, Input, Space, Tag, Typography, Upload } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import './profile-component.scss'
import { IUpdateProfilePayload } from '@/types/user'
import { toast } from 'react-toastify'
import { API_ENDPOINT, MODAL_TEXT, StorageKey, TOAST_MSG, VALIDATION } from '@/constants'
import ChangePasswordForm from '@/app/components/admin/ChangePassword/ChangePasswordForm'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import { generateRoleColor } from '../../utils/main.util'
import { EditOutlined } from '@ant-design/icons'
import { getFromLocalStorage } from '@/utils/local-storage.util'
import { UploadChangeParam } from 'antd/es/upload'
import { RcFile, UploadProps } from 'antd/lib/upload'

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

const EditSubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
  isEditInfo,
  onLoadingCallback,
  onChangeEditBtn
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false)
  const { userInformation, fetchUserInformation } = useAuth()
  const [updateUserProfile, { isLoading: confirmLoading }] = useUpdatePrivateUserProfileMutation()
  const values = Form.useWatch<IUpdateProfilePayload>([], form)

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(true)
      })
      .catch(() => setSubmittable(false))
  }, [form, values])

  const onEditProfile = async (): Promise<void> => {
    onLoadingCallback(true)
    await updateUserProfile({ userId: userInformation.id, userData: values })
      .unwrap()
      .then(() => {
        onChangeEditBtn()
        fetchUserInformation(userInformation.id)
        toast.success(TOAST_MSG.UPDATE_PROFILE_SUCCESS)
      })
      .then(() => {
        onLoadingCallback(false)
      })
  }

  return (
    <Button
      type='primary'
      htmlType='submit'
      loading={confirmLoading}
      onClick={onEditProfile}
      className={`${submittable && isEditInfo ? 'btn-primary' : 'btn-negative'}`}
    >
      {children}
    </Button>
  )
}

const ProfileComponent: React.FC = () => {
  const { userInformation, fetchUserInformation } = useAuth()
  const [storedUserId, setStoredUerId] = useState<string>(userInformation?.id)
  const [storedAvatar, setStoredAvatar] = useState<string>('')
  const { data: userProfile } = useGetPrivateUserProfileQuery({ userId: storedUserId })
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm<IUpdateProfilePayload>()
  const [isEditInfo, setIsEditInfo] = useState<boolean>(false)
  const changePasswordModalRef = useRef<IModalMethods | null>(null)
  const [_open, _setOpen] = useState<boolean>(false)

  const handleUploadSingleImage = (info: UploadChangeParam<UploadFile<{ isSuccess: boolean }>>): void => {
    if (info.file.status !== 'uploading') {
      console.log('Uploading')
    }
    if (info.file.status === 'done') {
      if (info?.file?.response && Object.keys(info?.file?.response).length) {
        toast.success(TOAST_MSG.UPLOAD_IMAGE_SUCCESS)
        fetchUserInformation(storedUserId)
      }
    } else if (info.file.status === 'error') {
      toast.error(TOAST_MSG.UPLOAD_IMAGE_FAILED)
    }
  }

  const uploadSingleImage: UploadProps = {
    name: 'image',
    action: API_ENDPOINT + `/users/${storedUserId}/avatar`,
    headers: {
      authorization: 'Bearer ' + getFromLocalStorage<string>(StorageKey._ACCESS_TOKEN)
    },
    onChange: handleUploadSingleImage,
    beforeUpload: (file: RcFile): boolean => {
      const isValidFile = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isValidFile) {
        toast.error(TOAST_MSG.ONLY_UPLOAD_SPECIFIC_TYPE)
      }
      return isValidFile
    },
    method: 'PATCH',
    multiple: false,
    showUploadList: false
  }

  useEffect(() => {
    if (userInformation) {
      setStoredUerId(userInformation.id)
      setStoredAvatar(userInformation.image)
    }
  }, [userInformation])

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber
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

  const openChangePasswordModal = (): void => {
    changePasswordModalRef.current?.showModal()
  }

  const closeChangePasswordModal = (): void => {
    changePasswordModalRef.current?.hideModal()
  }

  return (
    <>
      <Flex align='center' vertical className='--profile-wrapper scroll-bar-2'>
        <div style={{ width: '98%', maxWidth: 700 }}>
          <div className='profile-cover'>
            <Flex justify='center' style={{ marginBottom: '8px' }}>
              <div className='avatar-cover'>
                <ImageCustom width={150} height={150} src={storedAvatar} className='d-flex align-self-center' />
                <Tag color={generateRoleColor(userProfile?.role || '')} key={userProfile?.role} className='role'>
                  {userProfile?.role.toUpperCase()}
                </Tag>
                <Upload {...uploadSingleImage} accept='image/png, image/jpeg'>
                  <EditOutlined style={{ fontSize: 20, cursor: 'pointer' }} className='--edit-avatar-icon' />
                </Upload>
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
                <Input autoComplete='true' />
              </Form.Item>

              <Form.Item
                name='lastName'
                label='Last name'
                rules={[{ required: true, message: 'Please enter your last name' }]}
                validateTrigger={['onBlur']}
              >
                <Input value={userProfile?.lastName} />
              </Form.Item>

              <Form.Item name='email' label='Email' rules={VALIDATION.EMAIL} validateTrigger={['onBlur']}>
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name='phoneNumber'
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
              style={{ width: '105px' }}
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
              <Button type='default' htmlType='reset' className={`btn-primary`} onClick={openChangePasswordModal}>
                Change password
              </Button>
            </Flex>
          </div>
        </div>
      </Flex>

      <ChangePasswordModal
        title={MODAL_TEXT.CHANGE_PASSWORD_TITLE}
        width={400}
        content={
          <>
            <ChangePasswordForm closeModal={closeChangePasswordModal} />
          </>
        }
        ref={changePasswordModalRef}
      />
    </>
  )
}

export default ProfileComponent
