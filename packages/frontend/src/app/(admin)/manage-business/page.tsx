'use client'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps, Table, TableProps, Tag, Typography, Pagination, Row } from 'antd'
import { useState } from 'react'
import businessData from './business-data.json'
import { PlusOutlined } from '@ant-design/icons'
import TableComponent from '@/app/components/admin/Table/Table'
import './manage-business.scss'
import { IBusiness } from '@/types/business'

export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

const ManageBusiness = () => {
  const [userOption, setUserOption] = useState()

  const listColumns: ColumnsType<IBusiness> = [
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
            <Dropdown menu={{ items }} placement='bottom' trigger={['click']}>
              <EllipsisOutlined style={{ fontSize: 15, cursor: 'pointer' }} />
            </Dropdown>
          </>
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (category: string[]) => {
        return category.join(', ')
      }
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Total Reviews',
      dataIndex: 'totalReviews',
      key: 'totalReviews',
      width: 30
    },
    {
      title: 'Average Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      width: 30,
      render: (avgRating: number) => (
        <Flex justify='center' align='center'>
          <Typography.Text>{avgRating}</Typography.Text>
          <i className='fa-solid fa-star ms-2' style={{ color: '#FFD43B' }}></i>
        </Flex>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 250,
      render: (status: string) => {
        const color = status == 'ADMIN' ? 'green' : 'geekblue'
        return (
          <Tag color={color} key={status} style={{ margin: '4px 0px 0px 4px' }}>
            {status}
          </Tag>
        )
      }
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

  const businessWithKeys = businessData.map((item, index) => ({ ...item, key: index }))

  return (
    <>
      <Flex justify='space-between' style={{ marginBottom: 16, height: 40 }}>
        <Typography.Title className='mb-0' level={3}>
          Business
        </Typography.Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          className='h-100'
          style={{
            fontWeight: 700,
            padding: '0 20px'
          }}
        >
          Add Business
        </Button>
      </Flex>
      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={businessWithKeys}
        className='--manage-business-table'
      />
    </>
  )
}

export default ManageBusiness
