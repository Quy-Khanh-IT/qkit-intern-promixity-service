import { Button, Dropdown, Input, MenuProps, Space } from 'antd'
import React from 'react'
import './category-form.scss'
import { ICreateBusiness } from '@/types/business'

export default function CategoryForm({
  handleOnChangeStep,
  data,
  handleOnChangeData,
  listCategory
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (type: string, value: string | number | boolean | string[] | number[] | boolean[]) => void
  listCategory: { value: string; text: string }[] | []
}): React.ReactNode {
  const categoryItems: MenuProps['items'] =
    listCategory.length > 0
      ? listCategory.map((item) => ({
          key: item.value,
          label: item.text
        }))
      : []

  const handleCategoryMenuClick: MenuProps['onClick'] = (e) => {
    handleOnChangeData('categoryId', e.key)
  }

  const categoryProps = {
    items: categoryItems,
    onClick: handleCategoryMenuClick
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
          <h3 className='title'>Choose your business&apos;s category.</h3>
          <div className='mt-3'>Help customers discover your business by industry by adding a business type.</div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>Your business&apos;s category</div>
            <Dropdown className='ms-2' menu={categoryProps}>
              <Button className='btn-dropdown'>
                <Space className='category-meu-wrapper'>
                  {data.categoryId
                    ? listCategory.find((item) => item.value === data.categoryId)?.text
                    : 'Select category'}
                  <i className='fa-solid fa-angle-down'></i>
                </Space>
              </Button>
            </Dropdown>
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
