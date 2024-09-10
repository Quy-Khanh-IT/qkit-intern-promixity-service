'use client'
import { Button, Steps } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import './create-business.scss'

import { ICreateBusiness, IDayOfWeek } from '@/types/business'

import { useGetAllBusinessCategoriesQuery } from '@/services/category.service'

import { useGetProvincesQuery, useGetDistrictByProvinceCodeQuery } from '@/services/address.service'
import { useGetServicesQuery } from '@/services/service.service'
import NameForm from './components/NameForm'
import WebsiteForm from './components/WebsiteForm'
import CategoryForm from './components/CategoryFrom'
import AddressForm from './components/AddressForm'
import AddressLineForm from './components/AddressLineForm'
import { useCreateBusinessMutation } from '@/services/business.service'
import { ToastService } from '@/services/toast.service'
import { ErrorResponse } from '@/types/error'
import { useRouter } from 'next/navigation'
import { ROUTE } from '@/constants'
import OpenTimeForm from './components/OpenTimeForm'

export default function CreateBusiness(): React.ReactNode {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const router = useRouter()
  const [data, setData] = useState<ICreateBusiness>({
    name: '',
    description: '',
    categoryId: '',
    serviceIds: [],
    phoneNumber: '',
    website: '',
    dayOfWeek: [],
    country: 'Việt Nam',
    province: '',
    district: '',
    addressLine: '',
    fullAddress: '',
    location: {
      coordinates: [0, 0]
    }
  })

  const [openTimes, setOpenTimes] = useState<{ [key: string]: { isOpen: boolean; open: string; close: string } }>({
    Monday: { isOpen: false, open: '', close: '' },
    Tuesday: { isOpen: false, open: '', close: '' },
    Wednesday: { isOpen: false, open: '', close: '' },
    Thursday: { isOpen: false, open: '', close: '' },
    Friday: { isOpen: false, open: '', close: '' },
    Saturday: { isOpen: false, open: '', close: '' },
    Sunday: { isOpen: false, open: '', close: '' }
  })

  const toastService = useMemo<ToastService>(() => new ToastService(), [])

  const { data: getCategoryResponse } = useGetAllBusinessCategoriesQuery()
  const { data: getServiceResponse } = useGetServicesQuery()
  const [
    createBusiness,
    { isSuccess: isCreateBusinessSuccess, isError: isCreateBusinessError, error: createBusinessError }
  ] = useCreateBusinessMutation()

  const handleOnChangeData = (
    type: string,
    value: string | number | boolean | string[] | number[] | boolean[] | { coordinates: [number, number] }
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

      if (currentStep + 1 === 6) {
        const payload: ICreateBusiness = { ...data }
        payload.province = getProvinceName(data.province)
        payload.district = getDistrictName(data.district)
        payload.dayOfWeek = convertOpenTimesToDayOfWeek(openTimes)

        createBusiness(payload)
      }
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

  const getProvinceName = (provinceCode: string): string => {
    if (getProvinceResponse) {
      const province = getProvinceResponse.items.find((province) => province.code === provinceCode)
      if (province) {
        return province.full_name
      }
    }
    return ''
  }

  useEffect(() => {
    if (isCreateBusinessSuccess) {
      toastService.success('Create Success')
      router.push(ROUTE.MY_BUSINESS)
      window.location.reload()
    }
    if (isCreateBusinessError) {
      const errorResponse = createBusinessError as ErrorResponse
      toastService.showRestError(errorResponse)
    }
  }, [isCreateBusinessSuccess, isCreateBusinessError])

  const getDistrictName = (districtCode: string): string => {
    if (getDistrictResponse) {
      const district = getDistrictResponse.items.find((district) => district.code === districtCode)
      if (district) {
        return district.full_name
      }
    }
    return ''
  }

  const convertOpenTimesToDayOfWeek = (openTimes: {
    [key: string]: { isOpen: boolean; open: string; close: string }
  }): IDayOfWeek[] => {
    const dayOfWeek: IDayOfWeek[] = []

    for (const [day, times] of Object.entries(openTimes)) {
      if (times.isOpen) {
        dayOfWeek.push({
          day: day.toLowerCase(),
          openTime: times.open,
          closeTime: times.close
        })
      }
    }

    return dayOfWeek
  }
  return (
    <div className='h-100 w-100 create-business-container'>
      <div className=' mt-2 process-bar-container'>
        <div className='create-business-title d-flex justify-content-center mb-2'>
          <h2>Create Business</h2>
        </div>
        <Steps progressDot current={currentStep} size='small' items={stepList} />
        {currentStep > 0 ? (
          <Button onClick={() => handleOnChangeStep('back')} className='ms-5 mt-5'>
            Back <i className='fa-solid fa-chevron-left ms-1'></i>
          </Button>
        ) : (
          ''
        )}
      </div>
      <div className='create-business-content '>
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
          <OpenTimeForm openTimes={openTimes} setOpenTimes={setOpenTimes} handleOnChangeStep={handleOnChangeStep} />
        ) : currentStep === 4 ? (
          <AddressForm
            listProvince={getProvinceResponse && getProvinceResponse.items.length > 0 ? getProvinceResponse.items : []}
            listDistrict={getDistrictResponse && getDistrictResponse.items.length > 0 ? getDistrictResponse.items : []}
            handleOnChangeData={handleOnChangeData}
            data={data}
            handleOnChangeStep={handleOnChangeStep}
          />
        ) : currentStep === 5 ? (
          <AddressLineForm
            handleOnChangeData={handleOnChangeData}
            data={data}
            handleOnChangeStep={handleOnChangeStep}
            getProvinceName={getProvinceName}
            getDistrictName={getDistrictName}
          />
        ) : null}
      </div>
    </div>
  )
}
