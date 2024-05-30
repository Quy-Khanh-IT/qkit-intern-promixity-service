'use client'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import DeleteModal from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { MODAL_TEXT, ROLE_OPTIONS } from '@/constants'
import { useGetAllUsersQuery } from '@/services/user.service'
import { ColorConstant, ColumnsType, SelectionOptions } from '@/types/common'
import { GetAllUsersQuery } from '@/types/query'
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
  PaginationProps,
  Row,
  Select,
  Space,
  TableColumnType,
  Tag,
  Typography
} from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ACTIVE_OPTION, DELETE_OPTION } from '../admin.constant'
import './manage-user.scss'
import { RoleEnum } from '@/types/enum'

export interface IManageUserProps {}

const { Text } = Typography
const PAGE_SIZE = 20

// For search
type DataIndex = keyof IUserInformation

type SearchIndex = keyof GetAllUsersQuery

const ManageUser = (): React.ReactElement => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // User data
  const [queryData, setQueryData] = useState<GetAllUsersQuery>({
    offset: currentPage,
    limit: PAGE_SIZE
  } as GetAllUsersQuery)
  const { data: usersData, isFetching: isLoadingUsers } = useGetAllUsersQuery(queryData)
  const [userOption, setUserOption] = useState(ACTIVE_OPTION)
  const [userOne, setUserOne] = useState<IUserInformation>()

  // Modal
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refDecentralizeModal = useRef<IModalMethods | null>(null)
  const refDeleteUserModal = useRef<IModalMethods | null>(null)
  const [deleteModalTitle, setDeleteModalTitle] = useState(MODAL_TEXT.DELETE_USER_TITLE)
  const [deleteModalContent, setDeleteModalContent] = useState(MODAL_TEXT.DELETE_USER_TEMPORARY)
  const [decentralizeOpts, _setDecentralizeOpts] = useState<SelectionOptions[]>(ROLE_OPTIONS)

  // Other
  const searchInput = useRef<InputRef>(null)

  useEffect(() => {
    setQueryData(
      (prev) =>
        ({
          ...prev,
          offset: currentPage
        }) as GetAllUsersQuery
    )
  }, [currentPage])

  const handleModal = (selectedOpt: number): void => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === 2) {
      if (userOption === DELETE_OPTION) {
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
    _confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ): void => {
    if (selectedKeys.length === 0) {
      setQueryData((prev) => {
        const queryTemp: GetAllUsersQuery = { ...prev }
        delete queryTemp[dataIndex as SearchIndex]
        return { ...queryTemp } as GetAllUsersQuery
      })
    } else {
      setQueryData((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }) as GetAllUsersQuery)
    }
  }

  const handleReset = (clearFilters: () => void): void => {
    clearFilters()
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
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#8fce00' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) || false,
    onFilterDropdownOpenChange: (visible): void => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    }
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
            label: <span className={userOption === '2' ? 'error-modal-title' : ''}>Delete</span>,
            icon: (
              <i
                className={`fa-regular fa-trash ${userOption === '2' ? 'error-modal-title' : 'delete-icon'}`}
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
      render: (role: string): React.ReactNode => (
        <Tag color={generateRoleColor(role)} key={role} className='me-0'>
          {role.toUpperCase()}
        </Tag>
      ),
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
        console.log('value', value);
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
        <Tag color={generateRoleColor(userOne?.role || '')} key={userOne?.role} className='me-0'>
          {userOne?.role.toUpperCase()}
        </Tag>
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

  const handleDecentralizeRole = (): void => {}

  const handleDeleteUser = (): void => {}

  const onChangePagination: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page)
  }

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
            Total: <strong>{usersData?.totalRecords}</strong>
          </span>
        </Col>
      </Row>

      <TableComponent
        isFetching={isLoadingUsers}
        columns={listColumns}
        dataSource={usersData?.data ?? []}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: usersData?.totalRecords ?? 0,
          onChange: onChangePagination
        }}
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
                userOption === '2' && deleteModalContent === MODAL_TEXT.DELETE_USER_PERMANENT ? 'error-modal-title' : ''
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

const generateRoleColor = (role: string): string => {
  let color: string = ''

  if (role === (RoleEnum._ADMIN as string)) {
    color = ColorConstant._GREEN
  } else if (role === (RoleEnum._USER as string)) {
    color = ColorConstant._GEEK_BLUE
  } else if (role === (RoleEnum._BUSINESS as string)) {
    color = ColorConstant._VOLCANO
  }

  return color
}
