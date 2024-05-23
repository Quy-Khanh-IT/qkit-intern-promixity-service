'use client'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import DeleteModal from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { IUserInformation } from '@/types/user'
import {
  DeleteOutlined,
  EllipsisOutlined,
  FolderViewOutlined,
  SearchOutlined,
  UndoOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import {
  Button,
  Col,
  DescriptionsProps,
  Dropdown,
  Input,
  InputRef,
  MenuProps,
  Row,
  Select,
  Space,
  TableColumnType,
  Tag,
  Typography
} from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import './manage-user.scss'
import userData from './user-data.json'
import { ColumnsType } from '@/types/common'
import { MODAL_TEXT } from '@/constants'

export interface IManageUserProps {}

const { Text } = Typography

// For search
type DataIndex = keyof IUserInformation

const ManageUser = () => {
  const [userOption, setUserOption] = useState('1')
  const [userOne, setUserOne] = useState<IUserInformation>()
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refDecentralizeModal = useRef<IModalMethods | null>(null)
  const refDeleteUserModal = useRef<IModalMethods | null>(null)
  const [deleteModalTitle, setDeleteModalTitle] = useState(MODAL_TEXT.DELETE_USER_TEMPORARY)

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleModal = (selectedOpt: number) => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === 2) {
      refDecentralizeModal.current?.showModal()
    } else if (selectedOpt === 3) {
      refDeleteUserModal.current?.showModal()
    }
  }

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<IUserInformation> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
          <Button
            type='link'
            size='small'
            className='btn-cancel-small'
            onClick={() => {
              close()
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) || false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={(text || '') as string}
        />
      ) : (
        <>{text}</>
      )
  })

  const listColumns: ColumnsType<IUserInformation> = [
    {
      align: 'center',
      width: 75,
      onCell: (_user: IUserInformation, index: unknown) => {
        return {
          onClick: () => {
            if (typeof index === 'number') {
              setUserOne(userData[index])
            }
          }
        }
      },
      render: () => {
        const items: MenuProps['items'] = [
          {
            key: 'View Details',
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
            : [
                {
                  key: 'Restore',
                  label: <span>Restore</span>,
                  icon: <UndoOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
                  onClick: () => {
                    setDeleteModalTitle(MODAL_TEXT.RESTORE_USER)
                    handleModal(2)
                  }
                }
              ]),
          {
            key: 'Delete',
            label: <span>Delete</span>,
            icon: <DeleteOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
            onClick: () => {
              if (userOption === '2') {
                setDeleteModalTitle(MODAL_TEXT.DELETE_USER_PERMANENT)
              } else {
                setDeleteModalTitle(MODAL_TEXT.DELETE_USER_TEMPORARY)
              }
              handleModal(3)
            }
          }
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
      width: 120,
      ...getColumnSearchProps('firstName')
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 120,
      ...getColumnSearchProps('lastName')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 280,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address')
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      key: 'role',
      width: 250,
      render: (role: string) => {
        const color = role == 'ADMIN' ? 'green' : 'geekblue'
        return (
          <Tag color={color} key={role} className='me-0'>
            {role}
          </Tag>
        )
      },
      filters: [
        {
          text: 'ADMIN',
          value: 'ADMIN'
        },
        {
          text: 'USER',
          value: 'USER'
        },
        {
          text: 'BUSINESS',
          value: 'BUSINESS'
        }
      ],
      filterMode: 'tree',
      onFilter: (value, record: IUserInformation) => {
        return record.role.includes(value as string)
      }
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
      label: 'Role',
      span: 4,
      children: (
        <>
          {[userOne?.role].map((role, index) => {
            const color = role === 'ADMIN' ? 'green' : 'geekblue'
            return (
              <Tag color={color} key={`${role}-${index}`}>
                {role}
              </Tag>
            )
          })}
        </>
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

  const onChangeSelection = (value: string) => {
    // setInputFilter('')
    setUserOption(value)
  }

  const usersWithKeys = userData.map((item, index) => ({ ...item, key: index }))

  const handleDecentralizeRole = () => {}

  const handleDeleteUser = () => {}

  return (
    <div className='--manage-user'>
      <Row className='pb-3'>
        <Col span={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={20} sm={16} md={14} lg={10} xl={6}>
            <Select
              onChange={onChangeSelection}
              // style={{ marginTop: 16 }}
              optionFilterProp='children'
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
              className='filter-select w-100'
              value={userOption}
              // defaultValue={options[0]}
              options={options}
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
      <ViewRowDetailsModal title='User details' data={detailedItems} ref={refViewDetailsModal} />
      <DecentralizeModal
        selectionOptions={[]}
        ref={refDecentralizeModal}
        title={'Decentralize'}
        specificInfo={
          <>
            <Text>{userOne?.email}</Text>
          </>
        }
        handleConfirm={handleDecentralizeRole}
      >
        <Text>Email:</Text>
        <Text>Role:</Text>
      </DecentralizeModal>
      <DeleteModal
        title='Delete account'
        content={
          <>
            {deleteModalTitle} {'('}<strong>{userOne.email}</strong> {')'}
          </>
        }
        handleConfirm={handleDeleteUser}
        ref={refDeleteUserModal}
      />
    </div>
  )
}

export default ManageUser
