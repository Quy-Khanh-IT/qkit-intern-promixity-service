'use client'
import DecentralizeRoleModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import DeleteUserModal from '@/app/components/admin/DeleteModal/DeleteUserModal'
import { IModalMethods } from '@/app/components/admin/modal'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { IUserInformation } from '@/types/user'
import { DeleteOutlined, EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import {
  Col,
  DescriptionsProps,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  Row,
  Select,
  TableProps,
  Tag
} from 'antd'
import { useRef, useState } from 'react'
import './manage-user.scss'
import userData from './user-data.json'

export interface IManageUserProps {}

type ColumnsType<T extends object> = TableProps<T>['columns']

const ManageUser = () => {
  const [userOption, setUserOption] = useState('1')
  const [userOne, setUserOne] = useState<IUserInformation>()
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refDecentralizeRoleModal = useRef<IModalMethods | null>(null)
  const refDeleteUserModal = useRef<IModalMethods | null>(null)

  const handleModal = (selectedOpt: number) => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === 2) {
      refDecentralizeRoleModal.current?.showModal()
    } else if (selectedOpt === 3) {
      refDeleteUserModal.current?.showModal()
    }
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
      children: userOne?.firstName
    },
    {
      label: 'Last name',
      span: 2,
      children: userOne?.lastName
    },
    {
      label: 'Address',
      span: 4,
      children: userOne?.address
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
      )
    }
  ]

  const options = [
    {
      value: '1',
      label: 'Active users'
    },
    {
      value: '2',
      label: 'Deleted users'
    }
  ]

  const usersWithKeys = userData.map((item, index) => ({ ...item, key: index }))

  return (
    <div className='--manage-user'>
      <Row className='pb-3'>
        <Col span={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col span={4}>
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
              placeholder='Filter by email'
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
      {/* <Flex className='filter-section' align='center' style={{ margin: '8px 0 0' }} wrap='wrap'></Flex> */}

      {/* <Flex align='center' justify='space-between' className='pagination-section' wrap='wrap'>
        <Flex justify='end' className='total-text' style={{ marginTop: 16 }}>
          <span>
            Total: <strong>{16}</strong>
          </span>
        </Flex>
      </Flex> */}
      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={usersWithKeys}
        className='--manage-user-table'
      />
      <ViewRowDetailsModal data={detailedItems} ref={refViewDetailsModal} />
      <DecentralizeRoleModal userOne={null} decentralizeOpts={[]} ref={refDecentralizeRoleModal} />
      <DeleteUserModal userOne={null} isDeleted={null} ref={refDeleteUserModal} />
    </div>
  )
}

export default ManageUser
