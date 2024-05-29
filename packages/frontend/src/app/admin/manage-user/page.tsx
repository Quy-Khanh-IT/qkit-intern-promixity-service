'use client'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import DeleteModal from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { IUserInformation } from '@/types/user'
import { EllipsisOutlined, FolderViewOutlined, SearchOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
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
import { ColumnsType, SelectionOptions } from '@/types/common'
import { MODAL_TEXT, ROLE_CONST } from '@/constants'

export interface IManageUserProps {}

const { Text } = Typography
const ACTIVE_OPTION = '1'
const DELETE_OPTION = '2'

// For search
type DataIndex = keyof IUserInformation

const ManageUser = (): React.ReactElement => {
  const [userOption, setUserOption] = useState(ACTIVE_OPTION)
  const [userOne, setUserOne] = useState<IUserInformation>()
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refDecentralizeModal = useRef<IModalMethods | null>(null)
  const refDeleteUserModal = useRef<IModalMethods | null>(null)
  const [deleteModalTitle, setDeleteModalTitle] = useState(MODAL_TEXT.DELETE_USER_TITLE)
  const [deleteModalContent, setDeleteModalContent] = useState(MODAL_TEXT.DELETE_USER_TEMPORARY)
  const [decentralizeOpts, _setDecentralizeOpts] = useState<SelectionOptions[]>(ROLE_CONST) // as SelectionOptions[]

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleModal = (selectedOpt: number): void => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === 2) {
      if (userOption == DELETE_OPTION) {
        refDeleteUserModal.current?.showModal()
      } else {
        refDecentralizeModal.current?.showModal()
      }
    } else if (selectedOpt === 3) {
      refDeleteUserModal.current?.showModal()
    }
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ): void => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void): void => {
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
    onFilterDropdownOpenChange: (visible): void => {
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
      onCell: (user: IUserInformation): React.HTMLAttributes<HTMLElement> => {
        return {
          onClick: (): void => {
            setUserOne(user)
          }
        }
      },
      render: (): React.ReactNode => {
        const items: MenuProps['items'] = [
          {
            key: 'View Details',
            label: <span>View Details</span>,
            icon: <FolderViewOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
            onClick: () => handleModal(1)
          },
          ...(!(userOption === DELETE_OPTION)
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
                  onClick: (): void => {
                    setDeleteModalTitle(MODAL_TEXT.RESTORE_USER_TITLE)
                    setDeleteModalContent(MODAL_TEXT.RESTORE_USER)
                    handleModal(2)
                  }
                }
              ]),
          {
            key: 'Delete ',
            label: <span className={userOption == '2' ? 'error-modal-title' : ''}>Delete</span>,
            icon: (
              <i
                className={`fa-regular fa-trash ${userOption == '2' ? 'error-modal-title' : 'delete-icon'}`}
                style={{ fontSize: 15, cursor: 'pointer' }}
              ></i>
            ),
            onClick: (): void => {
              setDeleteModalTitle(MODAL_TEXT.DELETE_USER_TITLE)
              if (userOption === '2') {
                setDeleteModalContent(MODAL_TEXT.DELETE_USER_PERMANENT)
              } else {
                setDeleteModalContent(MODAL_TEXT.DELETE_USER_TEMPORARY)
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
      ...getColumnSearchProps('email')
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 280,
      ...getColumnSearchProps('phoneNumber')
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      key: 'role',
      width: 250,
      render: (role: string): React.ReactNode => {
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
      onFilter: (value, record: IUserInformation): boolean => {
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
      label: 'Phone number',
      span: 4,
      children: userOne?.phoneNumber
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

  const onChangeSelection = (value: string): void => {
    setUserOption(value)
  }

  // const usersWithKeys = userData.map((item, index) => ({ ...item, key: index }))

  const handleDecentralizeRole = (): void => {}

  const handleDeleteUser = (): void => {}

  return (
    <div className='--manage-user'>
      <Row className='pb-3'>
        <Col span={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={20} sm={16} md={14} lg={10} xl={6}>
            <Select
              onChange={onChangeSelection}
              optionFilterProp='children'
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
              className='filter-select w-100'
              value={userOption}
              options={options}
            />
          </Col>
        </Col>

        <Col span={8} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>
            Total: <strong>{'8'}</strong>
          </span>
        </Col>
      </Row>

      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={userData as IUserInformation[]}
        className='--manage-user-table'
      />
      <ViewRowDetailsModal title='User details' data={detailedItems} ref={refViewDetailsModal} />
      <DecentralizeModal
        selectionOptions={decentralizeOpts}
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
        title={deleteModalTitle}
        content={
          <>
            <span
              className={
                userOption == '2' && deleteModalContent == MODAL_TEXT.DELETE_USER_PERMANENT ? 'error-modal-title' : ''
              }
            >
              {deleteModalContent}
            </span>
            {'('}
            <strong>{userOne?.email}</strong> {')'}
          </>
        }
        handleConfirm={handleDeleteUser}
        ref={refDeleteUserModal}
      />
    </div>
  )
}

export default ManageUser
