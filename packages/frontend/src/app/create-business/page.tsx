'use client'
import { Steps } from 'antd'
import React, { useEffect, useState } from 'react'
import './create-business.scss'
import NameForm from './components/NameForm'
import { ICreateBusiness } from '@/types/business'
import WebsiteForm from './components/WebsiteForm'
import { useGetAllBusinessCategoriesQuery } from '@/services/category.service'
import CategoryForm from './components/CategoryFrom'
import AddressForm from './components/AddressForm'
import { useGetProvincesQuery, useGetDistrictByProvinceCodeQuery } from '@/services/address.service'
import { useGetServicesQuery } from '@/services/service.service'

export default function CreateBusiness(): React.ReactNode {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [data, setData] = useState<ICreateBusiness>({
    name: '',
    description: '',
    categoryId: '',
    serviceIds: [],
    phoneNumber: '',
    website: '',
    dayOfWeek: [],
    country: '',
    province: '',
    district: '',
    addressLine: '',
    fullAddress: '',
    location: {
      coordinates: [0, 0]
    }
  })

  const { data: getCategoryResponse } = useGetAllBusinessCategoriesQuery()
  const { data: getServiceResponse } = useGetServicesQuery()

  const handleOnChangeData = (
    type: string,
    value: string | number | boolean | string[] | number[] | boolean[]
  ): void => {
    setData({
      ...data,
      [type]: value
    })
  }

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

  const { data: getProvinceResponse } = useGetProvincesQuery()
  const { data: getDistrictResponse, isSuccess: getDistrictIsSuccess } = useGetDistrictByProvinceCodeQuery(
    data.province,
    { skip: data.province === '' }
  )

  useEffect(() => {
    handleOnChangeData('district', '')
  }, [getDistrictIsSuccess])

  console.log(getProvinceResponse)

  return (
    <div className='h-100 w-100'>
      <div className=' mt-3 h-30'>
        <div className='create-business-title d-flex justify-content-center mb-2'>
          <h2>Create Business</h2>
        </div>
        <Steps progressDot current={currentStep} size='small' items={stepList} />
      </div>
      <div className='create-business-content h-60'>
        {currentStep === 0 ? (
          <NameForm handleOnChangeData={handleOnChangeData} data={data} handleOnChangeStep={handleOnChangeStep} />
        ) : currentStep === 1 ? (
          <WebsiteForm handleOnChangeData={handleOnChangeData} data={data} handleOnChangeStep={handleOnChangeStep} />
        ) : currentStep === 2 ? (
          <CategoryForm
            listCategory={
              getCategoryResponse && getCategoryResponse.filterOpts.length > 0 ? getCategoryResponse.filterOpts : []
            }
            handleOnChangeData={handleOnChangeData}
            data={data}
            handleOnChangeStep={handleOnChangeStep}
            listService={getServiceResponse && getServiceResponse.items.length > 0 ? getServiceResponse.items : []}
          />
        ) : currentStep === 3 ? (
          <AddressForm
            listProvince={getProvinceResponse && getProvinceResponse.items.length > 0 ? getProvinceResponse.items : []}
            listDistrict={getDistrictResponse && getDistrictResponse.items.length > 0 ? getDistrictResponse.items : []}
            handleOnChangeData={handleOnChangeData}
            data={data}
            handleOnChangeStep={handleOnChangeStep}
          />
        ) : null}
      </div>
      <div className='d-flex justify-content-between h-10'>
        <button onClick={() => handleOnChangeStep('back')}>back</button>
        <button onClick={() => handleOnChangeStep('next')}>next</button>
      </div>
    </div>
  )
}
