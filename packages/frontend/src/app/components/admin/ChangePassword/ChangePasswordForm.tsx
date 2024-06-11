import { confirmPasswordValidator, newPasswordValidator, TOAST_MSG, VALIDATION } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { useUpdatePasswordProfileMutation } from '@/services/user.service'
import { IUpdatePasswordPayload } from '@/types/user'
import type { FormInstance } from 'antd'
import { Button, Flex, Form, Input, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './change-password-modal.scss'
import { ErrorDataResponse, ErrorResponse } from '@/types/error'

interface SubmitButtonProps extends ChangePasswordFormProps {
  form: FormInstance
}

interface ChangePasswordFormProps {
  closeModal: () => void
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ closeModal, form, children }) => {
  const [submittable, setSubmittable] = useState<boolean>(false)
  const [updatePasswordMutation, { isLoading: confirmLoading }] = useUpdatePasswordProfileMutation()
  const { userInformation } = useAuth()

  const values = Form.useWatch<IUpdatePasswordPayload>([], form)

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(true)
      })
      .catch(() => setSubmittable(false))
  }, [form, values])

  const clearForm = (): void => {
    form.resetFields()
    closeModal()
  }

  const handleChangePassword = async (): Promise<void> => {
    const passwordPayload: IUpdatePasswordPayload = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    }

    try {
      const { error } = await updatePasswordMutation({ userId: userInformation.id, passwordPayload })

      if (error) {
        const errorInstance = error as ErrorResponse
        if (errorInstance?.data) {
          const apiErrors: ErrorDataResponse = errorInstance?.data?.errors || ({} as ErrorDataResponse)
          if (Object.keys(apiErrors).length > 0) {
            form.setFields(
              Object.entries(apiErrors).map(([key, value]: [string, string[]]) => ({
                name: key,
                errors: value
              }))
            )
          }
        }
      } else {
        toast.success(TOAST_MSG.UPDATE_PASSWORD_SUCCESS)
        clearForm()
      }
    } catch (_error: unknown) {
      toast.error(TOAST_MSG.UNKNOWN_ERROR)
    }
  }

  const onSubmitForm = (): void => {
    handleChangePassword()
  }

  return (
    <Button
      type='primary'
      htmlType='submit'
      disabled={!submittable}
      onClick={onSubmitForm}
      loading={confirmLoading}
      className={`${submittable ? 'btn-primary' : 'btn-negative'}`}
    >
      {children}
    </Button>
  )
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ closeModal }) => {
  const [form] = Form.useForm<IUpdatePasswordPayload>()

  return (
    <>
      <Form
        form={form}
        name='changePasswordForm'
        layout='vertical'
        autoComplete='off'
        className='change-password-modal pb-3 pt-3'
      >
        <Form.Item name='oldPassword' label='Password' rules={VALIDATION.PASSWORD} className='mb-0'>
          <Input.Password
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
        <Form.Item
          name='newPassword'
          label='New password'
          rules={[
            { required: true, message: 'Please enter new password' },
            { validator: newPasswordValidator(form.getFieldValue, 'oldPassword') }
          ]}
          className='mb-0 mt-2'
        >
          <Input.Password
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
        <Form.Item
          name='confirmPassword'
          label='Confirm new password'
          className='mb-0 mt-2'
          rules={[
            { required: true, message: 'Please confirm your new password' },
            { validator: confirmPasswordValidator(form.getFieldValue, 'newPassword') }
          ]}
          validateTrigger={['onBlur']}
        >
          <Input.Password
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

        <Form.Item className='mb-0 mt-3'>
          <Flex justify='end' className='mt-2'>
            <Space>
              <SubmitButton form={form} closeModal={closeModal}>
                Xác nhận
              </SubmitButton>
            </Space>
          </Flex>
        </Form.Item>
      </Form>
    </>
  )
}

export default ChangePasswordForm
