import { TOAST_MSG, VALIDATION } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { useUpdatePasswordProfileMutation } from '@/services/user.service'
import { IUpdatePasswordPayload } from '@/types/user'
import type { FormInstance } from 'antd'
import { Button, Flex, Form, Input, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './change-password-modal.scss'

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
    await updatePasswordMutation({ userId: userInformation.id, passwordPayload: passwordPayload })
      .unwrap()
      .then(() => {
        clearForm()
        toast.success(TOAST_MSG.UPDATE_PASSWORD_SUCCESS)
      })
  }

  const onSubmitForm = (): void => {
    handleChangePassword()
    clearForm()
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
  const [form] = Form.useForm()

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
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='newPassword'
          label='New password'
          rules={[
            {
              // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              validator(_, value: string) {
                if (!value) {
                  return Promise.reject(new Error('Please enter password'))
                }
                if (value?.length < 6 || value?.length > 25) {
                  return Promise.reject(new Error('Password must be 6-25 characters long'))
                }
                if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,25}$/.test(value)) {
                  return Promise.reject(
                    new Error(
                      'Password must include at least one uppercase letter, one number, and one special character'
                    )
                  )
                }
                return Promise.resolve()
              }
            }
          ]}
          className='mb-0 mt-2'
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='confirmPassword'
          label='Confirm password'
          className='mb-0 mt-2'
          rules={[
            { required: true, message: 'Please confirm your password' },
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            ({ getFieldValue }) => ({
              // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              validator(_, value) {
                console.log('dang check')
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('The confirmation password does not match!'))
              }
            })
          ]}
          validateTrigger={['onBlur']}
        >
          <Input.Password />
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
