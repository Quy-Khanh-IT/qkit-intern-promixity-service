import { VALIDATION } from '@/constants'
import type { FormInstance } from 'antd'
import { Button, Flex, Form, Input, Space } from 'antd'
import React, { useState } from 'react'

// import { useAuth } from '~/context/AuthContext'
// import { useChangePasswordMutation } from '~/services/auth.service'
// import { IChangePasswordPayload } from '~/types/auth'

interface SubmitButtonProps extends ChangePasswordFormProps {
  form: FormInstance
}

interface ChangePasswordFormProps {
  closeModal: () => void
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ closeModal, form, children }) => {
  const [_submittable, _setSubmittable] = useState<boolean>(false)
  // const [changePassword, { isLoading }] = useChangePasswordMutation()
  // const { userInformation } = useAuth()

  // const values = Form.useWatch([], form)

  // useEffect(() => {
  //   form
  //     .validateFields({ validateOnly: true })
  //     .then(() => {
  //       setSubmittable(true)
  //     })
  //     .catch(() => setSubmittable(false))
  // }, [form, values])

  const stopHandle = () => {
    form.resetFields()
    closeModal()
  }

  // async/ Promise<void>
  const onCreateUser = (): void => {
    stopHandle()
    // const pwPayload: IChangePasswordPayload = {
    //   email: userInformation.email,
    //   currentPassword: values.currentPassword,
    //   newPassword: values.newPassword
    // }
    // await changePassword(pwPayload)
    //   .unwrap()
    //   .then(() => {
    //     stopHandle()
    //     toast.success('Thay đổi mật khẩu thành công')
    //   })
    //   .catch((error) => {
    //     toast.error(error.data.error)
    //   })
  }

  const onSubmitForm = () => {
    onCreateUser()
  }

  return (
    <Button
      type='primary'
      htmlType='submit'
      // disabled={!submittable}
      onClick={onSubmitForm}
      // loading={isLoading}
      className='btn-primary'
      // className={`${submittable ? 'btn-primary' : 'btn-negative'}`}
    >
      {children}
    </Button>
  )
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ closeModal }) => {
  const [form] = Form.useForm()

  return (
    <>
      <Form form={form} name='changePWForm' layout='vertical' autoComplete='off'>
        <Form.Item name='currentPassword' label='Mật khẩu' rules={VALIDATION.PASSWORD} validateTrigger={['onBlur']}>
          <Input type='password' />
        </Form.Item>
        <Form.Item name='newPassword' label='Mật khẩu mới' rules={VALIDATION.PASSWORD} validateTrigger={['onBlur']}>
          <Input type='password' />
        </Form.Item>
        <Form.Item
          name='newPasswordConfirm'
          label='Xác nhận mật khẩu mới'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
              }
            })
          ]}
          validateTrigger={['onBlur']}
        >
          <Input type='password' />
        </Form.Item>

        <Form.Item className='mb-0'>
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
