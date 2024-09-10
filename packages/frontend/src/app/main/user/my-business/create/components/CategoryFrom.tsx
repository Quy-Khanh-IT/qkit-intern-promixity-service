'use client'
import { Button, Dropdown, Input, MenuProps, Select, Space } from 'antd'
import React from 'react'
import './category-form.scss'
import { ICreateBusiness, IService } from '@/types/business'

export default function CategoryForm({
  handleOnChangeStep,
  data,
  handleOnChangeData,
  listCategory,
  listService
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (type: string, value: string | number | boolean | string[] | number[] | boolean[]) => void
  listCategory: { value: string; text: string }[] | []
  listService: IService[] | []
}): React.ReactNode {
  const filterOption = (input: string, option?: { label: string; value: string }): boolean =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

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
          <h3 className='title'>Choose your business&apos;s category.</h3>
          <div className='mt-3'>Help customers discover your business by industry by adding a business type.</div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>
              Your business&apos;s category <span className='required-input '>*</span>
            </div>

            <Select
              showSearch
              placeholder='Select a category'
              optionFilterProp='children'
              filterOption={filterOption}
              options={[
                ...listCategory.map((item) => ({
                  value: item.value,
                  label: item.text
                }))
              ]}
              value={listCategory.find((item) => item.value === data.categoryId)?.text}
              onChange={(value) => handleOnChangeData('categoryId', value)}
            />
          </div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>Your business&apos;s services</div>

            <Select
              className='service-selector'
              style={{ height: '100% !important' }}
              mode='multiple'
              placeholder='Select service'
              options={[
                ...listService.map((item) => ({
                  value: item.id,
                  label: item.name
                }))
              ]}
              value={data.serviceIds}
              onChange={(value: string[]) => handleOnChangeData('serviceIds', value)}
            />
          </div>
          <Button
            onClick={() => handleOnChangeStep('next')}
            disabled={!data.categoryId}
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
