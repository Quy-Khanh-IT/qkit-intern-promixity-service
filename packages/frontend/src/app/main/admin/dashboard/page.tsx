'use client'
import { DEFAULT_MONTH_FORMAT } from '@/constants'
import { STATISTIC_OPTIONS_VALUE } from '@/constants/statistic'
import variables from '@/sass/common/_variables.module.scss'
import { useLazyGetBusinessUserStatisticQuery } from '@/services/statistic.service'
import { SelectionOptions } from '@/types/common'
import { IBusinessUserStatisticQuery } from '@/types/query'
import { IBusinessUserStatistic } from '@/types/statistic'
import { Col, DatePicker, Row, Select } from 'antd'
import { DatePickerProps } from 'antd/es/date-picker'
import { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { overlayCardStyle } from '../../layout'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import SplineChart from './components/SplineChart'
import './dashboard.scss'
import dynamic from 'next/dynamic'

const splineOptions: SelectionOptions[] = [
  { value: STATISTIC_OPTIONS_VALUE._MONTH, label: 'By month' },
  { value: STATISTIC_OPTIONS_VALUE._YEAR, label: 'By year' }
]

const { light } = variables

const FIRST_PAYLOAD: IBusinessUserStatisticQuery = {
  timeline: 'year',
  month: 1,
  year: 2024,
  statusBusiness: 'all',
  statusUser: 'all'
}

const _Dashboard: React.FC = () => {
  const [queryData, setQueryData] = useState<IBusinessUserStatisticQuery>(FIRST_PAYLOAD)
  const [getBusinessUserStatistic, { data: businessUserData }] = useLazyGetBusinessUserStatisticQuery()

  const [selectionStatistic, setSelectionStatistic] = useState<string>(STATISTIC_OPTIONS_VALUE._YEAR)
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null)

  useEffect(() => {
    getBusinessUserStatistic(queryData)
  }, [queryData, getBusinessUserStatistic])

  const onChangeYearPicker: DatePickerProps['onChange'] = (date, _dateString) => {
    setSelectedYear(date)
    const year: number = date?.year()
    setQueryData({ ...queryData, year, timeline: STATISTIC_OPTIONS_VALUE._YEAR })
    setSelectedMonth(null)
  }

  const onChangeMonthPicker: DatePickerProps['onChange'] = (date, _dateString) => {
    setSelectedMonth(date)
    const month: number = date?.month()
    setQueryData({ ...queryData, month, timeline: STATISTIC_OPTIONS_VALUE._MONTH })
    setSelectedYear(null)
  }

  const onChangeSelection = (value: string): void => {
    setSelectionStatistic(value)
  }

  return (
    <>
      <Row className='gap-4 pb-4'>
        <Row className='w-100 gap-2' style={{ ...overlayCardStyle, backgroundColor: light }}>
          <Col span={24} className='d-flex justify-content-end gap-4'>
            {selectionStatistic === STATISTIC_OPTIONS_VALUE._YEAR ? (
              <DatePicker value={selectedYear} onChange={onChangeYearPicker} picker='year' style={{ height: 40 }} />
            ) : (
              <DatePicker
                value={selectedMonth}
                onChange={onChangeMonthPicker}
                picker='month'
                style={{ height: 40 }}
                format={DEFAULT_MONTH_FORMAT}
              />
            )}
            <Select
              defaultValue={selectionStatistic}
              style={{ width: 120 }}
              onChange={onChangeSelection}
              options={splineOptions}
            />
          </Col>
          <Col span={24}>
            <SplineChart dataProps={businessUserData as IBusinessUserStatistic} queryData={queryData} />
          </Col>
        </Row>

        <Row className='d-flex justify-content-between flex-wrap gap-4 w-100'>
          <Col style={{ ...overlayCardStyle, backgroundColor: light, flexGrow: 1 }} className='--pie-chart-custom'>
            <PieChart />
          </Col>
          <Col style={{ ...overlayCardStyle, backgroundColor: light, flexGrow: 1 }} className='--bar-chart-custom'>
            <BarChart />
          </Col>
        </Row>
      </Row>
    </>
  )
}

const DashboardDynamic = dynamic(() => Promise.resolve(_Dashboard), { ssr: false })

const Dashboard = (): React.ReactNode => {
  return <DashboardDynamic />
}

export default Dashboard
