'use client'
import TableComponent from '@/app/components/admin/Table/Table'
import { IBusiness } from '@/types/business'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import { Col, Dropdown, Flex, Input, MenuProps, Row, Select, TableProps, Tag, Typography } from 'antd'
import { useState } from 'react'
import businessData from './business-data.json'
import './manage-business.scss'

export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

const ManageBusiness = () => {
  const [userOption, setUserOption] = useState('1')

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
          <Typography.Text style={{ width: 40, textAlign: 'end' }}>{avgRating}</Typography.Text>
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
      label: 'Actice businesses'
    },
    {
      value: '2',
      label: 'Deleted businesses'
    }
  ]

  const businessWithKeys = businessData.map((item, index) => ({ ...item, key: index }))

  return (
    <div className='--manage-business'>
      <Row className='pb-3'>
        <Col span={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col span={5}>
            <Select
              // onChange={onChangeSelection}
              // style={{ marginTop: 16 }}
              optionFilterProp='children'
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
              className='filter-select w-100'
              value={userOption}
              // defaultValue={options[0]}
              options={options}
            />
          </Col>
          <Col span={12}>
            <Input
              // value={inputFilter}
              // style={{ marginTop: 16 }}
              className='filter-input'
              // onChange={(e) => onChangeInput(e.target.value)}
              placeholder='Filter by name'
            />
          </Col>
        </Col>

        <Col span={8} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* 'users?.itemCount' */}
          <span>
            Total: <strong>{'8'}</strong>
          </span>
        </Col>
      </Row>
      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={businessWithKeys}
        className='manage-business-table'
      />
    </div>
  )
}

export default ManageBusiness
