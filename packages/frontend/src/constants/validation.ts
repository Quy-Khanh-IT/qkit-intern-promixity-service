import { Rule } from 'antd/es/form'
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

export const newPasswordValidator =
  (getFieldValue: (_name: string) => string, checkField: string) =>
  async (_: RuleObject, value: string): Promise<void> => {
    if (getFieldValue(checkField) === value) {
      return Promise.reject(new Error('New password must be different from the old password'))
    }
    return Promise.resolve()
  }

export const confirmPasswordValidator =
  (getFieldValue: (_name: string) => string, checkField: string) =>
  async (_: RuleObject, value: StoreValue): Promise<void> => {
    if (getFieldValue(checkField) !== value) {
      return Promise.reject(new Error('The confirmation password does not match!'))
    }
    return Promise.resolve()
  }
