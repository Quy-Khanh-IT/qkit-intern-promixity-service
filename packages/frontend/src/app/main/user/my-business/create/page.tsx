'use client'
import { Steps } from 'antd'
import React, { useState } from 'react'

export default function CreateBusiness(): React.ReactNode {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const [stepList, setStepList] = useState<{ title: string; description: string }[]>([
    {
      title: 'Finished',
      description: 'Step 1'
    },
    {
      title: 'In Progress',
      description: 'Step 2'
    },
    {
      title: 'Waiting',
      description: 'Step 3'
    },
    {
      title: 'Waiting',
      description: 'Step 4'
    },
    {
      title: 'Waiting',
      description: 'Step 5'
    },
    {
      title: 'Waiting',
      description: 'Step 6'
    }
  ])

  const handleOnChangeStep = (type: string): void => {
    if (type === 'next') {
      const nextStep = currentStep + 1 > stepList.length - 1 ? stepList.length - 1 : currentStep + 1
      const currentStepList = [...stepList]

      currentStepList.forEach((step, index) => {
        if (index < nextStep) {
          step.title = 'Finished'
        } else if (index === nextStep) {
          step.title = 'In Progress'
        } else {
          step.title = 'Waiting'
        }
      })

      setStepList(currentStepList)
      setCurrentStep(nextStep)
    } else if (type === 'back') {
      const prevStep = currentStep - 1 < 0 ? 0 : currentStep - 1
      const currentStepList = [...stepList]

      currentStepList.forEach((step, index) => {
        if (index < prevStep) {
          step.title = 'Finished'
        } else if (index === prevStep) {
          step.title = 'In Progress'
        } else {
          step.title = 'Waiting'
        }
      })

      setStepList(currentStepList)
      setCurrentStep(prevStep)
    }
  }

  return (
    <div className='h-100 w-100'>
      <div></div>
      <div className=' mt-3'>
        <div className='create-business-title'>
          <h2>Create Business</h2>
        </div>
        <Steps progressDot current={currentStep} size='small' items={stepList} />
      </div>
      <div className='d-flex justify-content-between'>
        <button onClick={() => handleOnChangeStep('back')}>back</button>
        <button onClick={() => handleOnChangeStep('next')}>next</button>
      </div>
    </div>
  )
}
