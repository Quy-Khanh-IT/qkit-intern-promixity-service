'use client'
import { useRef, useState, useEffect } from 'react'
import './time-filter.scss'
import { Radio, RadioChangeEvent, Space } from 'antd'
import { ITimeFilterProps } from '@/types/map'
import { set } from 'lodash-es'

export default function TimeFilter(props: ITimeFilterProps): React.ReactNode {
  const [timeSelectVisible, setTimeSelectVisible] = useState<boolean>(false)

  const [isActiveDetailOption, setIsActiveDetailOption] = useState<boolean>(
    props.timeOption.timeOpenType === 'specific_time'
  )

  const timeSelectWrapperRef = useRef<HTMLDivElement>(null)
  const timeFilterButtonRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement
      if (
        timeSelectWrapperRef.current &&
        !timeSelectWrapperRef.current.contains(event.target as Node) &&
        !target.closest('.time-filter-wrapper') &&
        !timeFilterButtonRef.current?.contains(event.target as Node)
      ) {
        setTimeSelectVisible(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return (): void => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const onChangeTimeOption = (e: RadioChangeEvent): void => {
    props.handleOnChangeTimeOption('timeOpenType', e.target.value as string)
    if (e.target.value === 'specific_time') {
      setIsActiveDetailOption(true)
    } else {
      setIsActiveDetailOption(false)
    }
  }

  const onChangeDayOption = (day: string): void => {
    props.handleOnChangeTimeOption('day', day)
  }

  const onChangeHourOption = (hour: string): void => {
    props.handleOnChangeTimeOption('openTime', hour)
  }

  const getDayButtonClassName = (day: string): string => {
    const isActive = isActiveDetailOption && props.timeOption.day === day
    return `${isActive ? 'is-active' : ''} btn-time-detail btn-day`
  }

  const getHourButtonClassName = (hour: string): string => {
    const isActive = isActiveDetailOption && props.timeOption.openTime === hour
    return `${isActive ? 'is-active' : ''} btn-time-detail btn-hour`
  }

  const handleApplyTimeSearch = (): void => {
    setTimeSelectVisible(false)
    props.handleOnApplyTimeFilter()
  }

  const handleOnClearTimeOption = (): void => {
    props.handleOnChangeTimeOption('day', 'monday')
    props.handleOnChangeTimeOption('openTime', '01:00')
    props.handleOnChangeTimeOption('timeOpenType', 'every_time')
    setIsActiveDetailOption(false)
  }

  return (
    <>
      <div
        ref={timeFilterButtonRef}
        onClick={() => setTimeSelectVisible(!timeSelectVisible)}
        className='time-filter-wrapper h-100 d-flex align-items-center justify-content-center'
      >
        <i className='fa-regular fa-clock me-1'></i>
        <div>Hours</div>
        <i className='fa-solid fa-sort-down ms-1 mb-1 down-icon'></i>

        {/* Time Select */}
      </div>
      {timeSelectVisible ? (
        <div ref={timeSelectWrapperRef} className='time-select-wrapper fade-in'>
          <div className='mt-2'>
            <div className='pb-2'>
              <Radio.Group
                className='d-flex flex-column'
                value={props.timeOption.timeOpenType}
                onChange={onChangeTimeOption}
              >
                <Space className='container pb-2' direction='vertical'>
                  <Radio className='radio-option' value={'every_time'}>
                    <div className='ps-2'> Any time</div>
                  </Radio>
                  <Radio className='radio-option' value={'is_opening'}>
                    <div className='ps-2'> Open now</div>
                  </Radio>
                  <Radio className='radio-option' value={'all_day'}>
                    <div className='ps-2'> Open 24 hours</div>
                  </Radio>
                </Space>
                <Space className='w-100 container time-select-bottom pt-2'>
                  <Radio className='radio-option' value={'specific_time'}>
                    <div className='ps-2'> Open on</div>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className='h-100 w-100 time-detail-option d-flex'>
              <div className='time-detail-day d-flex flex-column align-items-center  pt-2 pb-2 container'>
                <button onClick={() => onChangeDayOption('sunday')} className={getDayButtonClassName('sunday')}>
                  Sunday
                </button>
                <button onClick={() => onChangeDayOption('monday')} className={getDayButtonClassName('monday')}>
                  Monday
                </button>
                <button onClick={() => onChangeDayOption('tuesday')} className={getDayButtonClassName('tuesday')}>
                  Tuesday
                </button>
                <button onClick={() => onChangeDayOption('wednesday')} className={getDayButtonClassName('wednesday')}>
                  Wednesday
                </button>
                <button onClick={() => onChangeDayOption('thursday')} className={getDayButtonClassName('thursday')}>
                  Thursday
                </button>
                <button onClick={() => onChangeDayOption('friday')} className={getDayButtonClassName('friday')}>
                  Friday
                </button>
                <button onClick={() => onChangeDayOption('saturday')} className={getDayButtonClassName('saturday')}>
                  Saturday
                </button>
              </div>
              <div className='time-detail-hour d-flex  container pt-2 pb-2 flex-column'>
                <div className='w-100 d-flex'>
                  <div className='w-50 d-flex flex-column align-items-center pe-1'>
                    <button onClick={() => onChangeHourOption('00:00')} className={getHourButtonClassName('00:00')}>
                      Midnight
                    </button>
                    <button onClick={() => onChangeHourOption('01:00')} className={getHourButtonClassName('01:00')}>
                      1:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('02:00')} className={getHourButtonClassName('02:00')}>
                      2:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('03:00')} className={getHourButtonClassName('03:00')}>
                      3:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('04:00')} className={getHourButtonClassName('04:00')}>
                      4:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('05:00')} className={getHourButtonClassName('05:00')}>
                      5:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('06:00')} className={getHourButtonClassName('06:00')}>
                      6:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('07:00')} className={getHourButtonClassName('07:00')}>
                      7:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('08:00')} className={getHourButtonClassName('08:00')}>
                      8:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('09:00')} className={getHourButtonClassName('09:00')}>
                      9:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('10:00')} className={getHourButtonClassName('10:00')}>
                      10:00 AM
                    </button>
                    <button onClick={() => onChangeHourOption('11:00')} className={getHourButtonClassName('11:00')}>
                      11:00 AM
                    </button>
                  </div>
                  <div className='w-50  d-flex flex-column align-items-center ps-1'>
                    <button onClick={() => onChangeHourOption('12:00')} className={getHourButtonClassName('12:00')}>
                      Noon
                    </button>
                    <button onClick={() => onChangeHourOption('13:00')} className={getHourButtonClassName('13:00')}>
                      1:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('14:00')} className={getHourButtonClassName('14:00')}>
                      2:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('15:00')} className={getHourButtonClassName('15:00')}>
                      3:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('16:00')} className={getHourButtonClassName('16:00')}>
                      4:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('17:00')} className={getHourButtonClassName('17:00')}>
                      5:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('18:00')} className={getHourButtonClassName('18:00')}>
                      6:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('19:00')} className={getHourButtonClassName('19:00')}>
                      7:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('20:00')} className={getHourButtonClassName('20:00')}>
                      8:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('21:00')} className={getHourButtonClassName('21:00')}>
                      9:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('22:00')} className={getHourButtonClassName('22:00')}>
                      10:00 PM
                    </button>
                    <button onClick={() => onChangeHourOption('23:00')} className={getHourButtonClassName('23:00')}>
                      11:00 PM
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='container mt-2 d-flex justify-content-between'>
              <div></div>
              <div className='d-flex align-items-center '>
                <div onClick={handleOnClearTimeOption} className='btn-clear me-2'>
                  Clear
                </div>
                <div onClick={handleApplyTimeSearch} className='btn-apply '>
                  Apply
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
