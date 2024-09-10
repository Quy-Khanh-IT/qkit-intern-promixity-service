'use client'
import { Button, Input } from 'antd'
import React, { useState } from 'react'
import './name-form.scss'
import { ICreateBusiness } from '@/types/business'
import TextArea from 'antd/es/input/TextArea'

export default function NameForm({
  handleOnChangeStep,
  data,
  handleOnChangeData
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (type: string, value: string | number | boolean | string[] | number[] | boolean[]) => void
}): React.ReactNode {
  return (
    <div className='name-form-main'>
      <div className='name-form-header d-flex mt-5 w-100 container'>
        <div className='content-left w-50 d-flex align-items-center justify-content-center'>
          <img src='https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/coordinate-thumb.jpg' />
        </div>
        <div className='content-right w-50  d-flex justify-content-center flex-column container'>
          <h3 className='title'>Help customers find your business on Proximity Service, Maps and more.</h3>
          <div className='mt-3'>Enter some business information to get started</div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>
              Business name
              <span className='required-input '>*</span>
            </div>
            <Input
              value={data.name}
              onChange={(e) => handleOnChangeData('name', e.target.value)}
              placeholder='Enter business name'
            />
          </div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>Business description</div>
            <TextArea
              value={data.description}
              onChange={(e) => handleOnChangeData('description', e.target.value)}
              rows={4}
              placeholder='Input your business description'
            />
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
