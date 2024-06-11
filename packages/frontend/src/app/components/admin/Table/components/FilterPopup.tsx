import { FilterOptions, IOptionsPipe, SelectionOptions } from '@/types/common'
import { Button, Checkbox, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { ColumnType } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'

interface IFilterPopupProps<K> {
  dataIndex: K
  optionsData: IOptionsPipe
  filterCustom?: FilterOptions[]
  selectCustom?: SelectionOptions[]
  defaultValue?: string[]
  _handleFilter: (_selectedKeys: string[], _confirm: FilterDropdownProps['confirm'], _dataIndex: K) => void
}

const CheckboxGroup = Checkbox.Group

const FilterPopupProps = <T, K extends keyof T>({
  defaultValue,
  dataIndex,
  optionsData,
  filterCustom,
  selectCustom,
  _handleFilter
}: IFilterPopupProps<K>): ColumnType<T> => {
  const [optionsDataValue, setOptionsDataValue] = useState<string[]>([])
  const checkedList = useRef<string[]>([])

  const checkAll = useRef<boolean>(false)
  const indeterminate = useRef<boolean>(false)

  useEffect(() => {
    checkedList.current = defaultValue || []

    checkAll.current = optionsData?.selectionOpts.length === checkedList.current.length

    indeterminate.current =
      checkedList.current.length > 0 && checkedList.current.length < optionsData?.selectionOpts.length
  }, [defaultValue, optionsData?.selectionOpts.length])

  useEffect(() => {
    if (optionsData) {
      setOptionsDataValue(optionsData.selectionOpts.map((option) => option.value))
    }
  }, [optionsData])

  const onCheckAllChange = (e: CheckboxChangeEvent, setSelectedKeys: (_keys: React.Key[]) => void): void => {
    const checkedTempList = e.target.checked ? optionsDataValue : []
    setSelectedKeys(checkedTempList)
    if (e.target.checked) {
      checkAll.current = true
      checkedList.current = checkedTempList
    } else {
      checkAll.current = false
      checkedList.current = []
    }
    indeterminate.current = false
  }

  const handleReset = (clearFilters: () => void): void => {
    checkAll.current = false
    indeterminate.current = false
    checkedList.current = []
    clearFilters()
  }

  return {
    filters: filterCustom ?? optionsData?.filterOpts,
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }): React.ReactNode => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} className='d-flex flex-column gap-2'>
        <Checkbox
          indeterminate={indeterminate.current}
          onChange={(e) => onCheckAllChange(e, setSelectedKeys)}
          checked={checkAll.current}
        >
          Check all
        </Checkbox>
        <CheckboxGroup
          options={selectCustom ?? optionsData?.selectionOpts}
          value={checkedList.current}
          onChange={(list: string[]) => {
            checkedList.current = list
            setSelectedKeys(list)
            if (list.length === 0) {
              checkAll.current = false
              indeterminate.current = false
            } else {
              const checkSelectedBoolean: boolean = list.length === optionsDataValue.length
              checkAll.current = checkSelectedBoolean
              indeterminate.current = !checkSelectedBoolean
            }
          }}
          className='flex-column ps-4 gap-2'
        />
        <Space className='mt-2'>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
            className='btn-negative-small'
          >
            Reset
          </Button>
          <Button
            type='primary'
            onClick={() => _handleFilter(checkedList.current, confirm, dataIndex)}
            size='small'
            style={{ width: 90 }}
            className='btn-primary-small'
          >
            Filter
          </Button>
        </Space>
      </div>
    )
  }
}

export default FilterPopupProps
