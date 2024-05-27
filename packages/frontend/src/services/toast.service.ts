import { ErrorResponse } from '@/types/error'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export class ToastService {
  constructor(private router = useRouter()) {}
  private handleError(error: ErrorResponse): string {
    const prefixes = ['ATH', 'OTP', 'USR', 'BUS', 'CVL']
    let errorMessage: string | undefined = error?.data?.message || 'Something wrong on server!'

    const startsWithAny = prefixes.some((prefix) => errorMessage?.startsWith(prefix))

    if (errorMessage === 'USR_0011') {
      this.router.push('/signup/?token=' + error?.data?.errors?.token)
    }

    if (startsWithAny) {
      errorMessage = Array.isArray(error?.data?.errors?.detail)
        ? error?.data?.errors?.detail.join(', ')
        : error?.data?.errors?.detail || errorMessage
    }
    return errorMessage || ''
  }

  showRestError(error: ErrorResponse) {
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
