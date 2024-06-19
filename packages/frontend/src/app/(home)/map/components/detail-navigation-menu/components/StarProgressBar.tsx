import React from 'react'
import './star-progress-bar.scss'
import { Progress } from 'antd'
import { IStar } from '@/types/business'

export default function StarProgressBar({ stars }: { stars: IStar[] }): React.ReactNode {
  const maxCount = Math.max(...stars.map((star) => star.count))

  return (
    <div>
      {stars.map((star) => (
        <div key={star.star} className='d-flex justify-content-between align-items-center'>
          <div className=' star-number'>{star.star}</div>
          <Progress
            className='star-progress-bar'
            strokeColor={'#FCB627'}
            percent={(star.count / maxCount) * 100}
            showInfo={false}
          />
        </div>
      ))}
    </div>
  )
}
