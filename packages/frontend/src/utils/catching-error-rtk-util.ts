import { TOAST_MSG } from '@/constants'
import { ErrorResponse } from '@/types/error'
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { isRejected, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

/**
 * Log a warning and show a toast!
 */

const clarifyError = (error: ErrorResponse): string => {
  const prefixes = ['ATH', 'OTP', 'USR', 'BUS', 'CVL']
  let errorMessage: string | undefined = error?.data?.message || TOAST_MSG.SERVER_NOT_RESPONDING

  const startsWithAny = prefixes.find((prefix) => errorMessage?.startsWith(prefix))

  if (startsWithAny) {
    if (startsWithAny === 'ATH') {
      errorMessage = TOAST_MSG.LOGIN_FAILED
    } else {
      errorMessage = Array.isArray(error?.data?.errors?.detail)
        ? error?.data?.errors?.detail.join(', ')
        : error?.data?.errors?.detail || errorMessage
    }
  }
  return errorMessage || ''
}

export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const errorData = action.payload as ErrorResponse

    if (errorData.data && errorData.data?.errors && 'message' in errorData.data.errors) {
      toast.error(clarifyError(errorData))
    }
  } else if (isRejected(action)) {
    if (action?.error?.name !== 'ConditionError') {
      toast.error(TOAST_MSG.SERVER_NOT_RESPONDING, { toastId: 'default-error' })
    }
  }

  return next(action)
}
