import { useRouter } from 'next/router'
import React from 'react'

const ReviewDetails = (): React.ReactNode => {
  const router = useRouter()
  return <div>ReviewDetails + {router.query.slug}</div>
}

export default ReviewDetails
