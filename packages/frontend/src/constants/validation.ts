import { Rule } from 'antd/es/form'

export const VALIDATION = {
  EMAIL: [
    { required: true, message: 'Please enter email' },
    { type: 'email', message: 'Email format is not valid' }
  ] as Rule[],
  PASSWORD: [
    { required: true, message: 'Please enter password' },
    { min: 6, message: 'Password has at least 6 letters' }
  ] as Rule[],
  UPDATE_PASSWORD: [
    { required: true, message: 'Please enter password' },
    {
      min: 6,
      max: 25,
      message: 'Password must be 6-25 characters long'
    },
    {
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,25}$/,
      message: 'Password must include at least one uppercase letter, one number, and one special character'
    }
  ] as Rule[]
}
