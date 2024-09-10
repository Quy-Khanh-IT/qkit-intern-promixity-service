'use client'
import { Button, Input, Select } from 'antd'
import React from 'react'
import './address-form.scss'
import { ICreateBusiness } from '@/types/business'
import { District, Province } from '@/types/address'

export default function AddressForm({
  handleOnChangeStep,
  data,
  handleOnChangeData,
  listProvince,
  listDistrict
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (type: string, value: string | number | boolean | string[] | number[] | boolean[]) => void
  listProvince: Province[] | []
  listDistrict: District[] | []
}): React.ReactNode {
  const filterOption = (input: string, option?: { label: string; value: string }): boolean =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleOnChangeProvince = (value: string): void => {
    handleOnChangeData('province', value)
  }

  return (
    <div className='name-form-main'>
      <div className='name-form-header d-flex mt-5 w-100 container'>
        <div className='content-left w-50 d-flex align-items-center justify-content-center'>
          <img
            className='thumb'
            src='https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/website-thumb.png'
          />
        </div>
        <div className='content-right w-50  d-flex justify-content-center flex-column container'>
          <h3 className='title'>Enter your business address.</h3>
          <div className='mt-3'>Add a location where customers can visit your business directly.</div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>Country</div>
            <Input disabled value={'Việt Nam'} placeholder='Business country' />
          </div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>
              Province <span className='required-input '>*</span>
            </div>
            <Select
              size='middle'
              showSearch
              placeholder='Select a province'
              optionFilterProp='children'
              filterOption={filterOption}
              options={listProvince.map((item) => ({
                value: item.code,
                label: item.full_name
              }))}
              onChange={(value: string) => handleOnChangeProvince(value)}
              value={listProvince.find((item) => item.code === data.province)?.full_name ?? ''}
            />
          </div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>
              District <span className='required-input '>*</span>
            </div>
            <Select
              size='middle'
              showSearch
              placeholder='Select a district'
              optionFilterProp='children'
              filterOption={filterOption}
              options={listDistrict.map((item) => ({
                value: item.code,
                label: item.full_name
              }))}
              onChange={(value: string) => handleOnChangeData('district', value)}
              value={listDistrict.find((item) => item.code === data.district)?.full_name ?? ''}
            />
          </div>
          <Button
            onClick={() => handleOnChangeStep('next')}
            disabled={!data.district}
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
