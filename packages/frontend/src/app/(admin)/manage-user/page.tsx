'use client'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps, Table, TableProps, Tag, Typography } from 'antd'
import { useState } from 'react'
import './manage-user.scss'
import userData from './user-data.json'
import { PlusOutlined } from '@ant-design/icons';

export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

interface DataType {
  key: string
  firstName: string
  lastName: string
  address: string
  roles: string[]
}

const ManageUser = () => {
  const [userOption, setUserOption] = useState()

  const listColumns: ColumnsType<DataType> = [
    {
      width: 75,
      align: 'center',
      render: () => {
        const items: MenuProps['items'] = [
          {
            key: 'Xem chi tiết',
            label: <span>Xem chi tiết</span>,
            icon: <FolderViewOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
          },
          ...(!(userOption === '2')
            ? [
                {
                  key: 'Phân quyền',
                  label: <span>Phân quyền</span>,
                  icon: <UserAddOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
                }
              ]
            : []),
          ...(!(userOption === '2')
            ? [
                {
                  key: 'Xoá',
                  label: <span>Xoá</span>,
                  icon: <DeleteOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
                }
              ]
            : [
                {
                  key: 'Khôi phục',
                  label: <span>Khôi phục</span>,
                  icon: <UndoOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
                }
              ])
        ]
        return (
          <>
            <Dropdown menu={{ items }} placement='bottom'>
              <EllipsisOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
            </Dropdown>
          </>
        )
      }
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 200
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 200
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      width: 250,
      render: (roles: string[]) => (
        <Flex justify='center' wrap>
          {roles?.map((role, _index) => {
            const color = role == 'ADMIN' ? 'green' : 'geekblue'
            return (
              <Tag color={color} key={role} style={{ margin: '4px 0px 0px 4px' }}>
                {role}
              </Tag>
            )
          })}
        </Flex>
      )
    }
  ]

  const options = [
    {
      value: '1',
      label: 'Người dùng còn hoạt động'
    },
    {
      value: '2',
      label: 'Người dùng đã bị xoá'
    }
  ]

  const data: DataType[] = userData

  return (
    <>
      <Flex justify='space-between' style={{    marginBottom: 16,
    height: 40}}>
        <Typography.Title className='mb-0' level={3}>User</Typography.Title>
        <Button type='primary' icon={<PlusOutlined />} className='h-100' style={{
    fontWeight: 700,
    padding: '0 20px'}}>Add User</Button>
      </Flex>
      <Table
        columns={listColumns}
        pagination={false}
        dataSource={data}
        // 80 header, 48 external padding, 40 internal padding, 56 header content
        style={{ maxHeight: 'calc(100vh - 80px - 48px - 40px - 56px)' }}
        className='scroll-bar-2 --manage-table'
      />
    </>
  )
}

export default ManageUser
