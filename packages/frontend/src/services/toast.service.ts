import { toast } from 'react-toastify'

export class ToastService {
  private handleError(error: any): string {
    const prefixes = ['ATH', 'OTP', 'USR', 'BUS', 'CVL']
    let errorMessage = error?.data?.message || 'Something wrong on server!'

    const startsWithAny = prefixes.some((prefix) => errorMessage.startsWith(prefix))

    if (startsWithAny) {
      errorMessage = error?.data?.errors?.detail
    }
    return errorMessage
  }

  showRestError(error: any) {
    toast.error(this.handleError(error))
  }

  success(message: string) {
    toast.success(message)
  }

  error(message: string) {
    toast.error(message)
  }

  warning(message: string) {
    toast.warning(message)
  }
}
