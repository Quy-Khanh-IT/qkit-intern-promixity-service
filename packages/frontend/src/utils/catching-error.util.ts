import { ErrorResponse } from '@/types/error'
import { toast } from 'react-toastify'

export function generateError(response: ErrorResponse): void {
  const errors = response.data?.errors
  if (errors) {
    const afterProcess = Object.keys(errors).map((key: string) => errors[key])
    afterProcess.forEach((err) => {
      toast.error(err)
    })
  }
}
