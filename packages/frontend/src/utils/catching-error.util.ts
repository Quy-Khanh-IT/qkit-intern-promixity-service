export interface ResponseError {
  errors?: Record<string, unknown>
  status: number
  title: string
  traceId: string
  type: string
}

export function generateError(response: ResponseError): void {
  const { errors } = response
  if (errors) {
    const afterProcess = Object.keys(errors).map((key: string) => errors[key])
    afterProcess.forEach((err) => {
      console.log(err)
    })
  }
}
