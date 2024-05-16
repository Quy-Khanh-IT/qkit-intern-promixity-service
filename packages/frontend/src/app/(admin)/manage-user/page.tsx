'use client'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal, { ViewRowDetailsModalMethods } from '@/app/components/admin/ViewRowDetails/ViewRowDetails'
import { IUserInformation } from '@/types/user'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import { DescriptionsProps, Dropdown, Flex, MenuProps, TableProps, Tag } from 'antd'
import { useRef, useState } from 'react'
import './manage-user.scss'
import userData from './user-data.json'

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
      onCell: (user: IUserInformation) => {
        return {
          onClick: () => {
            setUserOne(userData[0])
          }
        }
      },
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
              <Tag color={color} key={role} style={{ margin: '6px 0px 0px 6px' }}>
                {role}
              </Tag>
            )
          })}
        </Flex>
      )
    }
  ]

  const detailedItems: DescriptionsProps['items'] = [
    {
      label: 'First name',
      span: 2,
      children: userOne?.firstName,
    },
    {
      label: 'Last name',
      span: 2,
      children: userOne?.lastName,
    },
    {
      label: 'Address',
      span: 4,
      children: userOne?.address,
    },
    {
      label: 'Roles',
      span: 4,
      children: (
        <Flex wrap>
          {userOne?.roles?.map((role, _index) => {
            const color = role == 'ADMIN' ? 'green' : 'geekblue'
            return (
              <Tag color={color} key={role} style={{ display: 'flex', alignItems: 'center' }}>
                {role}
              </Tag>
            )
          })}
        </Flex>
      ),
    }
  ];

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
      <ViewRowDetailsModal title={'User details'} data={detailedItems} ref={refViewDetailsModal} />
    </>
  )
}

export default ManageUser
