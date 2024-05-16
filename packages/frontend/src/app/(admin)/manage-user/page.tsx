'use client'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal, { ViewRowDetailsModalMethods } from '@/app/components/admin/ViewRowDetails/ViewRowDetails'
import { IUserInformation } from '@/types/user'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import { Col, Dropdown, Flex, InputNumber, MenuProps, Row, TableProps, Tag, Typography, theme } from 'antd'
import { useRef, useState } from 'react'
import userData from './user-data.json'
import './manage-user.scss'



export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

const ManageUser = () => {
  const [userOption, setUserOption] = useState()
  const [userOne, setUserOne] = useState<IUserInformation>()
  const refViewDetailsModal = useRef<ViewRowDetailsModalMethods | null>(null)

  const handleModal = (selectedOpt: number) => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    }
    // else if (selectedOpt === 2) {
    //   decentralizeRoleRef.current?.showModal()
    // } else if (selectedOpt === 3) {
    //   deleteUserRef.current?.showModal()
    // }
  }

  const listColumns: ColumnsType<IUserInformation> = [
    {
      width: 75,
      align: 'center',
      render: () => {
        const items: MenuProps['items'] = [
          {
            key: 'View details',
            label: <span>View Details</span>,
            icon: <FolderViewOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
            onClick: () => handleModal(1)
          },
          ...(!(userOption === '2')
            ? [
                {
                  key: 'Decentralize',
                  label: <span>Decentralize</span>,
                  icon: <UserAddOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
                  onClick: () => handleModal(2)
                }
              ]
            : []),
          ...(!(userOption === '2')
            ? [
                {
                  key: 'Xoá',
                  label: <span>Xoá</span>,
                  icon: <DeleteOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
                  onClick: () => handleModal(3)
                }
              ]
            : [
                {
                  key: 'Khôi phục',
                  label: <span>Khôi phục</span>,
                  icon: <UndoOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
                  onClick: () => handleModal(3)
                }
              ])
        ]
        return (
          <>
            <Dropdown menu={{ items }} placement='bottom' trigger={['click']} arrow>
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

  const usersWithKeys = userData.map((item, index) => ({ ...item, key: index }))

  return (
    <>
      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={usersWithKeys}
        className='--manage-user-table'
      />
      <ViewRowDetailsModal title={'User details'} data={userData[0]} ref={refViewDetailsModal} />
    </>
  )
}

export default ManageUser
