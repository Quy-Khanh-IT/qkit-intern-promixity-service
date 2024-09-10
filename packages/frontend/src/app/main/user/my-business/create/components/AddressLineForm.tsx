'use client'
import { Button, Input, List, Typography } from 'antd'
import React, { useEffect, useState, useMemo } from 'react'
import './address-line-form.scss'
import { ICreateBusiness } from '@/types/business'
import { IAddressLinePayload } from '@/types/address'
import AddressLineMap from './address-line-map'
import { useGetAddressLineQuery } from '@/services/address-line.service'
import { SearchProps } from 'antd/es/input'
import { ToastService } from '@/services/toast.service'

export default function AddressLineForm({
  handleOnChangeStep,
  data,
  handleOnChangeData,
  getProvinceName,
  getDistrictName
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (
    type: string,
    value: string | number | boolean | string[] | number[] | boolean[] | { coordinates: [number, number] }
  ) => void
  getProvinceName: (provinceCode: string) => string
  getDistrictName: (districtCode: string) => string
}): React.ReactNode {
  const addressLinePayload: IAddressLinePayload = {
    q: `${data.fullAddress}, ${getDistrictName(data.district)}, ${getProvinceName(data.province)}`,
    countrycodes: 'vn',
    addressdetails: 1,
    limit: 1,
    format: 'jsonv2'
  }

  const toastService = useMemo<ToastService>(() => new ToastService(), [])
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [searchPosition, setSearchPosition] = useState<[number, number]>([10.878599, 106.807282])

  const { Search } = Input
  const {
    data: getAddressLineResponse,
    isSuccess: isGetAddressLineSuccess,
    isError: isGetAddressLineError
  } = useGetAddressLineQuery(addressLinePayload, { skip: !isSearch })

  const onSearch: SearchProps['onSearch'] = () => {
    console.log('onSearch')
    setIsSearch(true)
  }

  useEffect(() => {
    if (getAddressLineResponse) {
      try {
        setSearchPosition([parseFloat(getAddressLineResponse[0].lat), parseFloat(getAddressLineResponse[0].lon)])
        handleOnChangeData('addressLine', getAddressLineResponse[0].address.road)
      } catch (error) {
        toastService.error("This address doesn't exist! Please try another address.")
      }
    }
    setIsSearch(false)
  }, [isGetAddressLineSuccess, isGetAddressLineError])

  return (
    <div className='name-form-main'>
      <div className='name-form-header d-flex mt-5 w-100 container'>
        <div className='content-left w-50 d-flex justify-content-center flex-column'>
          <h3 className='title'>Enter your business address line.</h3>
          <div className='mt-3'>Add a location where customers can visit your business directly.</div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>Address line</div>

            <Search
              onChange={(e) => handleOnChangeData('fullAddress', e.target.value)}
              value={data.fullAddress}
              size='large'
              placeholder='input full address'
              onSearch={onSearch}
              enterButton
            />
          </div>
          {getAddressLineResponse ? (
            <div className='data-list-wrapper mt-2'>
              <List
                header={<div>Results</div>}
                bordered
                dataSource={[
                  getAddressLineResponse && getAddressLineResponse.length > 0
                    ? getAddressLineResponse[0].display_name
                    : ''
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </div>
          ) : (
            ''
          )}
          <Button
            onClick={() => {
              handleOnChangeStep('next')
            }}
            disabled={
              !data.addressLine ||
              !data.location.coordinates ||
              data.location.coordinates[0] === 0 ||
              data.location.coordinates[1] === 0
            }
            className='mt-4 btn-continue '
            type='primary'
          >
            Finish
          </Button>
        </div>
        <div className='content-right w-50  d-flex justify-content-center  container'>
          <AddressLineMap data={data} handleOnChangeData={handleOnChangeData} position={searchPosition} />
        </div>
      </div>
    </div>
  )
}
