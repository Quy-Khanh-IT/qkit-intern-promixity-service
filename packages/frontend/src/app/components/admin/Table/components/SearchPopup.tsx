import { Input, Button, Space, InputRef } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/es/table'
import React, { useRef } from 'react'
import { FilterDropdownProps } from 'antd/es/table/interface'

interface ISearchPopupProps<K> {
  dataIndex: K
  _handleSearch: (_selectedKeys: string[], _confirm: FilterDropdownProps['confirm'], _dataIndex: K) => void
}

const SearchPopupProps = <T, K extends keyof T>({ dataIndex, _handleSearch }: ISearchPopupProps<K>): ColumnType<T> => {
  const searchInput = useRef<InputRef>(null)

  const handleReset = (clearFilters: () => void): void => {
    clearFilters()
  }

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }): React.ReactNode => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
        setTimeout(() => searchInput.current?.select(), 100)
      }
    }
  }
}

export default SearchPopupProps
