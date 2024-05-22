import { ErrorRespone } from '@/types/error'
import { toast } from 'react-toastify'

export class ToastService {
  private handleError(error: ErrorRespone): string {
    const prefixes = ['ATH', 'OTP', 'USR', 'BUS', 'CVL']
    let errorMessage: string | undefined = error?.data?.message || 'Something wrong on server!'

    const startsWithAny = prefixes.some((prefix) => errorMessage?.startsWith(prefix))

    if (startsWithAny) {
      errorMessage = Array.isArray(error?.data?.errors?.detail)
        ? error?.data?.errors?.detail.join(', ')
        : error?.data?.errors?.detail || errorMessage
    }
    return errorMessage || ''
  }

  showRestError(error: ErrorRespone) {
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
