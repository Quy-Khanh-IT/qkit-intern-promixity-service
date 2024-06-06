import { Button, Input, MenuProps, Space, Dropdown } from 'antd'
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
  const provinceItems: MenuProps['items'] =
    listProvince.length > 0
      ? listProvince.map((item) => ({
          key: item.code,
          label: item.full_name
        }))
      : []

  const districtItems: MenuProps['items'] =
    listDistrict.length > 0
      ? listDistrict.map((item) => ({
          key: item.code,
          label: item.full_name
        }))
      : []

  const handleProvinceClick: MenuProps['onClick'] = (e) => {
    handleOnChangeData('province', e.key)
  }

  const handleDistrictClick: MenuProps['onClick'] = (e) => {
    handleOnChangeData('district', e.key)
  }

  const provinceProps = {
    items: provinceItems,
    onClick: handleProvinceClick
  }

  const districtProps = {
    items: districtItems,
    onClick: handleDistrictClick
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
            <div className='input-label mb-2'>Province</div>
            <Dropdown className='ms-2' menu={provinceProps}>
              <Button className='btn-dropdown'>
                <Space className='category-meu-wrapper'>
                  <i className='fa-solid fa-angle-down'></i>
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>District</div>
            <Dropdown className='ms-2' menu={districtProps}>
              <Button className='btn-dropdown'>
                <Space className='category-meu-wrapper'>
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
