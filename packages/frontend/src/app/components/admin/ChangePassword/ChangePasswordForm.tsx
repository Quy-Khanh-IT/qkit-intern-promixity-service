import { VALIDATION } from '@/constants'
import type { FormInstance } from 'antd'
import { Button, Flex, Form, Input, Space } from 'antd'
import React, { useState } from 'react'

interface SubmitButtonProps extends ChangePasswordFormProps {
  form: FormInstance
}

interface ChangePasswordFormProps {
  closeModal: () => void
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ closeModal, form, children }) => {
  const [_submittable, _setSubmittable] = useState<boolean>(false)

  const stopHandle = (): void => {
    form.resetFields()
    closeModal()
  }

  const onCreateUser = (): void => {
    stopHandle()
  }

  const onSubmitForm = (): void => {
    onCreateUser()
  }

  return (
    <Button type='primary' htmlType='submit' onClick={onSubmitForm} className='btn-primary'>
      {children}
    </Button>
  )
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ closeModal }) => {
  const [form] = Form.useForm()

  return (
    <>
      <Form form={form} name='changePWForm' layout='vertical' autoComplete='off' className='pb-3 pt-3'>
        <Form.Item name='currentPassword' label='Mật khẩu' rules={VALIDATION.PASSWORD} validateTrigger={['onBlur']}>
          <Input type='password' />
        </Form.Item>
        <Form.Item name='newPassword' label='Mật khẩu mới' rules={VALIDATION.PASSWORD} validateTrigger={['onBlur']}>
          <Input type='password' />
        </Form.Item>
        <Form.Item
          name='newPasswordConfirm'
          label='Xác nhận mật khẩu mới'
          rules={VALIDATION.CONFIRM_PASSWORD}
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
