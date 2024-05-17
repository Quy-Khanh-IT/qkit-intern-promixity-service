export const confirmPasswordValidation = (getFieldValue: (_: string) => string) => ({
  validator(_: unknown, value: string) {
    if (!value || getFieldValue('newPassword') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
  }
})
