import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, InputRef, Space } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import React, { useRef } from 'react'

interface ISearchPopupProps<K> {
  dataIndex: K
  _handleSearch: (_selectedKeys: string[], _confirm: FilterDropdownProps['confirm'], _dataIndex: K) => void
}

const SearchPopupProps = <T, K extends keyof T>({ dataIndex, _handleSearch }: ISearchPopupProps<K>): ColumnType<T> => {
  const searchRef = useRef<InputRef>(null)
  const searchValueRef = useRef<string[]>([])

  const handleReset = (clearFilters: () => void): void => {
    clearFilters()
  }

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }): React.ReactNode => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchRef}
          placeholder={`Search ${String(dataIndex)}`}
          value={searchValueRef.current[0]}
          onChange={(e) => {
            const value = e.target.value ? [e.target.value] : []
            setSelectedKeys(value)
            searchValueRef.current = value
          }}
          onPressEnter={() => _handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => _handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
            className='btn-primary-small'
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
            className='btn-negative-small'
          >
            Reset
          </Button>
          <Button type='link' size='small' className='btn-cancel-small' onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#8fce00' : undefined }} />,
    onFilter: (value: unknown, record: T): boolean =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) || false,
    onFilterDropdownOpenChange: (visible): void => {
      if (visible) {
        setTimeout(() => searchRef.current?.select(), 100)
      }
    }
  }
}

export default SearchPopupProps
