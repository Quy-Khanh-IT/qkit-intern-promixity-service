import { MANAGE_USER_ROLE_PROPS } from '@/app/admin/manage-user/manage-user.const'
import { ROLE_OPTIONS } from '@/constants'
import { Button, Checkbox, InputRef, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { ColumnType } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import React, { useRef, useState } from 'react'

interface IFilterPopupProps<K> {
  dataIndex: K
  _handleFilter: (_selectedKeys: string[], _confirm: FilterDropdownProps['confirm'], _dataIndex: K) => void
}

const CheckboxGroup = Checkbox.Group

const plainOptions = ROLE_OPTIONS

const FilterPopupProps = <T, K extends keyof T>({ dataIndex, _handleFilter }: IFilterPopupProps<K>): ColumnType<T> => {
  const searchInput = useRef<InputRef>(null)

  const [checkedList, setCheckedList] = useState<string[]>([])

  const checkAll = plainOptions.length === checkedList.length
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length

  // const onCheckAllChange = (e: CheckboxChangeEvent, selectedKeys: (keys: React.Key[]) => void): void => {
  //   // setCheckedList(e.target.checked ? plainOptions.map((roleGroup): string => roleGroup.value) : [])
  //   selectedKeys(e.target.checked ? plainOptions.map((roleGroup): string => roleGroup.value) : [])
  // }
  const onCheckAllChange = (e: CheckboxChangeEvent, setSelectedKeys: (_keys: React.Key[]) => void): void => {
    setSelectedKeys(e.target.checked ? plainOptions.map((roleGroup): string => roleGroup.value) : [])
  }

  const handleReset = (clearFilters: () => void): void => {
    setCheckedList([])
    clearFilters()
  }

  return {
    filters: MANAGE_USER_ROLE_PROPS,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close: _close }): React.ReactNode => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} className='d-flex flex-column gap-2'>
        <Checkbox
          indeterminate={indeterminate}
          onChange={(e) => onCheckAllChange(e, setSelectedKeys)}
          checked={checkAll}
        >
          Check all
        </Checkbox>
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={(list: string[]) => setSelectedKeys(list)}
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
            onClick={() => _handleFilter(selectedKeys as string[], confirm, dataIndex)}
            size='small'
            style={{ width: 90 }}
            className='btn-primary-small'
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record: T): boolean => {
      console.log('value', value)
      return record[dataIndex] === (value as string).toLowerCase()
    },
    onFilterDropdownOpenChange: (visible): void => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    }
  }
}

export default FilterPopupProps
