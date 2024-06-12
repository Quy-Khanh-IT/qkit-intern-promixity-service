import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, InputRef, Space } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import React, { useEffect, useRef } from 'react'

interface ISearchPopupProps<K> {
  dataIndex: K
  placeholder: string
  defaultValue?: string[]
  _handleSearch: (_selectedKeys: string[], _confirm: FilterDropdownProps['confirm'], _dataIndex: K) => void
}

const SearchPopupProps = <T, K extends keyof T>({
  dataIndex,
  placeholder,
  defaultValue,
  _handleSearch
}: ISearchPopupProps<K>): ColumnType<T> => {
  const searchRef = useRef<InputRef>(null)
  const searchValueRef = useRef<string[]>([])
  const setSelectedKeysRef = useRef<((_keys: React.Key[]) => void) | null>(null)

  useEffect(() => {
    searchValueRef.current = defaultValue || []
    if (setSelectedKeysRef.current) {
      setSelectedKeysRef.current(defaultValue || [])
    }
  }, [defaultValue])

  const handleReset = (clearFilters: () => void): void => {
    searchValueRef.current = []
    clearFilters()
  }

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }): React.ReactNode => {
      setSelectedKeysRef.current = setSelectedKeys

      return (
        <>
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchRef}
              placeholder={`Search ${placeholder.toLowerCase()}`}
              value={searchValueRef.current[0]}
              onChange={(e) => {
                const value = e.target.value ? [e.target.value] : []
                setSelectedKeys(value)
                searchValueRef.current = value
              }}
              onPressEnter={() => {
                _handleSearch(selectedKeys as string[], confirm, dataIndex)
                close()
              }}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type='primary'
                onClick={() => {
                  _handleSearch(selectedKeys as string[], confirm, dataIndex)
                  close()
                }}
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
        </>
      )
    },
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#8fce00' : undefined }} />,
    onFilterDropdownOpenChange: (visible): void => {
      if (visible) {
        setTimeout(() => searchRef.current?.select(), 100)
      }
    }
  }
}

export default SearchPopupProps
