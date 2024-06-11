import { Rule } from 'antd/es/form'
// validator-form.ts
import { RuleObject } from 'antd/lib/form'
import { StoreValue } from 'rc-field-form/lib/interface'

export const VALIDATION = {
  EMAIL: [
    { required: true, message: 'Please enter email' },
    { type: 'email', message: 'Email format is not valid' }
  ] as Rule[],
  PASSWORD: [
    { required: true, message: 'Please enter password' },
    { min: 6, message: 'Password has at least 6 letters' }
  ] as Rule[]
}

export const passwordValidator =
  (getFieldValue: (_name: string) => string, checkField: string) =>
  async (_: RuleObject, value: string): Promise<void> => {
    if (!value) {
      return Promise.reject(new Error('Please enter password'))
    }
    if (getFieldValue(checkField) === value) {
      return Promise.reject(new Error('New password must be different from the old password'))
    }
    if (value.length < 6 || value.length > 25) {
      return Promise.reject(new Error('Password must be 6-25 characters long'))
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,25}$/.test(value)) {
      return Promise.reject(
        new Error('Password must include at least one uppercase letter, one number, and one special character')
      )
    }
    return Promise.resolve()
  }

export const confirmPasswordValidator =
  (getFieldValue: (_name: string) => string, checkField: string) =>
  async (_: RuleObject, value: StoreValue): Promise<void> => {
    if (!value) {
      return Promise.reject(new Error('Please enter your new password'))
    }
    if (getFieldValue(checkField) !== value) {
      return Promise.reject(new Error('The confirmation password does not match!'))
    }
    return Promise.resolve()
  }
