'use client'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps, Table, TableProps } from 'antd'
import { useState } from 'react'
import './manage-user.scss'

export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

interface DataType {
  key: string
  email: string
  phone: number
  role: string
}

const ManageUser = () => {
  const [userOption, setUserOption] = useState()

  const listColumns: ColumnsType<any> = [
    {
      width: '8%',
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: '25%'
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'role',
      key: 'role',
      width: '25%'
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

  const data: DataType[] = [
    {
      key: '1',
      email: 'John Brown',
      phone: 32,
      role: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      email: 'Joe Black',
      phone: 42,
      role: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      email: 'Jim Green',
      phone: 32,
      role: 'Sydney No. 1 Lake Park'
    },
    {
      key: '4',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    },
    {
      key: '5',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    },
    {
      key: '6',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    },
    {
      key: '7',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    },
    {
      key: '8',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    },
    {
      key: '9',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    },
    {
      key: '10',
      email: 'Jim Red',
      phone: 32,
      role: 'London No. 2 Lake Park'
    }
  ]

  return (
    <div>
      <Table
        columns={listColumns}
        pagination={false}
        dataSource={data}
        style={{ overflowY: 'scroll', maxHeight: '400px' }}
        className='scroll-bar-2 --manage-table'
      />
    </div>
  )
}

export default ManageUser
