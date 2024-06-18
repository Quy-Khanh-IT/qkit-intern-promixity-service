'use client'
import { Button, Input, Switch } from 'antd'
import React, { useState } from 'react'
import './open-time-form.scss'
import { ICreateBusiness } from '@/types/business'

export default function OpenTimeForm({
  handleOnChangeStep,
  data,
  handleOnChangeData
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (type: string, value: string | number | boolean | string[] | number[] | boolean[]) => void
}): React.ReactNode {
  const [daysOpen, setDaysOpen] = useState<{
    Monday: boolean
    Tuesday: boolean
    Wednesday: boolean
    Thursday: boolean
    Friday: boolean
    Saturday: boolean
    Sunday: boolean
  }>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleDayChange = (day: string, checked: boolean): void => {
    setDaysOpen((prevDaysOpen) => ({
      ...prevDaysOpen,
      [day]: checked
    }))
  }

  console.log(daysOpen)

  return (
    <div className='name-form-main'>
      <div className='name-form-header d-flex mt-5 w-100 container'>
        <div className='content-left w-50 d-flex align-items-center justify-content-center'>
          <img src='https://cdn.dribbble.com/users/2291435/screenshots/16930972/media/d7cefacc44f2065c4781beeebd84fdcc.png?resize=400x400&vertical=center' />
        </div>
        <div className='content-right w-50  d-flex justify-content-center flex-column container'>
          <h3 className='title'>Help users know when your business is closed and open.</h3>
          <div className='mt-3'>Add business hours</div>

          <div className='input-wrapper mt-3 time-wrapper'>
            {daysOfWeek.map((day, index) => (
              <div key={index} className='d-flex mb-3 align-items-center justify-content-between '>
                <div className='day-title'>{day}</div>
                <div className='d-flex align-items-center justify-content-between time-status'>
                  <Switch
                    size='small'
                    checked={daysOpen[day as keyof typeof daysOpen]}
                    onChange={(checked) => handleDayChange(day, checked)}
                  />
                  <div className='ms-2'>{daysOpen[day as keyof typeof daysOpen] ? 'Open' : 'Closed'}</div>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => handleOnChangeStep('next')}
            disabled={!data.name}
            className='mt-4 btn-continue '
            type='primary'
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
