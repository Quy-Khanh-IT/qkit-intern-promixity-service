'use client'
import React, { useState } from 'react'
import { Button, Switch } from 'antd'
import './open-time-form.scss'

export default function OpenTimeForm({
  handleOnChangeStep,

  openTimes,
  setOpenTimes
}: {
  openTimes: { [key: string]: { isOpen: boolean; open: string; close: string } }
  setOpenTimes: React.Dispatch<
    React.SetStateAction<{ [key: string]: { isOpen: boolean; open: string; close: string } }>
  >
  handleOnChangeStep: (type: string) => void
}): React.ReactNode {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleDayChange = (day: string, checked: boolean): void => {
    setOpenTimes((prevOpenTimes) => ({
      ...prevOpenTimes,
      [day]: { ...prevOpenTimes[day], isOpen: checked }
    }))
  }

  const handleOpenTimeChange = (day: string, type: 'open' | 'close', value: string): void => {
    setOpenTimes((prevOpenTimes) => ({
      ...prevOpenTimes,
      [day]: { ...prevOpenTimes[day], [type]: value }
    }))

    setErrors({})
  }

  const handleContinue = (): void => {
    let hasError = false
    const newErrors: { [key: string]: string } = {}

    daysOfWeek.forEach((day) => {
      if (openTimes[day].isOpen) {
        const openTime = openTimes[day].open
        const closeTime = openTimes[day].close

        if (!openTime || !closeTime) {
          hasError = true
          newErrors[`${day}_open`] = 'Please enter opening hours'
          newErrors[`${day}_close`] = 'Please enter closing time'
        } else {
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          if (!timeRegex.test(openTime) || !timeRegex.test(closeTime)) {
            hasError = true
            newErrors[`${day}_open`] = 'Open value must be hh:mm'
            newErrors[`${day}_close`] = 'Close value must be hh:mm'
          } else {
            const [openHours, openMinutes] = openTime.split(':').map(Number)
            const [closeHours, closeMinutes] = closeTime.split(':').map(Number)

            if (openHours > closeHours || (openHours === closeHours && openMinutes >= closeMinutes)) {
              hasError = true
              newErrors[`${day}_open`] = 'Opening hours must <= closing hours'
              newErrors[`${day}_close`] = 'Closing hours must >= opening hours'
            }
          }
        }
      }
    })

    setErrors(newErrors)

    if (!hasError) {
      handleOnChangeStep('next')
    }
  }

  return (
    <div className='name-form-main'>
      <div className='name-form-header d-flex mt-3 w-100 container'>
        <div className='content-left w-50 d-flex align-items-center justify-content-center'>
          <img src='https://cdn.dribbble.com/users/2291435/screenshots/16930972/media/d7cefacc44f2065c4781beeebd84fdcc.png?resize=400x400&vertical=center' />
        </div>
        <div className='content-right w-50  d-flex justify-content-center flex-column container'>
          <h3 className='title'>Let customers know when you are open for business</h3>
          <div className='mt-3'>Add business hours</div>
          <div className='input-wrapper mt-3 '>
            {daysOfWeek.map((day, index) => (
              <div key={index} className='mb-3'>
                <div className='d-flex  align-items-center justify-content-between time-wrapper'>
                  <div className='day-title'>{day}</div>
                  <div className='d-flex align-items-center justify-content-between time-status'>
                    <Switch
                      size='small'
                      checked={openTimes[day].isOpen}
                      onChange={(checked) => handleDayChange(day, checked)}
                    />
                    <div className='ms-2'>{openTimes[day].isOpen ? 'Open' : 'Closed'}</div>
                  </div>
                </div>
                {openTimes[day].isOpen ? (
                  <div className='mt-1'>
                    <input
                      className='hour-input'
                      placeholder='Opens at'
                      value={openTimes[day].open}
                      onChange={(e) => handleOpenTimeChange(day, 'open', e.target.value)}
                    />
                    <i className='fa-solid fa-minus ms-1 me-2'></i>
                    <input
                      className='hour-input'
                      placeholder='Closes at'
                      value={openTimes[day].close}
                      onChange={(e) => handleOpenTimeChange(day, 'close', e.target.value)}
                    />
                    <div className='d-flex align-items-center '>
                      {errors[`${day}_open`] && <div className='error-message me-2'>{errors[`${day}_open`]}</div>}
                      {errors[`${day}_close`] && <div className='error-message'>{errors[`${day}_close`]}</div>}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleContinue} className='mt-4 btn-continue ' type='primary'>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
