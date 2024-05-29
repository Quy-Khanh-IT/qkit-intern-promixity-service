import { Rule } from 'antd/es/form'

export const confirmPasswordValidation = (getFieldValue: (_: string) => string): Rule => ({
  validator(_: unknown, value: string): Promise<void> {
    if (!value || getFieldValue('newPassword') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
  }
})
