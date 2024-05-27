import { confirmPasswordValidation } from '@/utils/validation'
import { Rule } from 'antd/es/form'

export const VALIDATION = {
  EMAIL: [
    { required: true, message: 'Vui lòng nhập email!' },
    { type: 'email', message: 'Định dạng email không hợp lệ!' }
  ] as Rule[],
  PASSWORD: [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
  ] as Rule[],
  CONFIRM_PASSWORD: [
    { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
    confirmPasswordValidation
  ] as Rule[]
}
