import { toast } from 'react-toastify'

export class ToastService {
  private handleError(error: any) {}

  showRestError(error: any) {}

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
