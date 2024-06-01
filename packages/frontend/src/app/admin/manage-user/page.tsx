'use client'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import { default as DeleteModal, default as RestoreModal } from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'
import FilterPopupProps from '@/app/components/admin/Table/components/FilterPopup'
import SearchPopupProps from '@/app/components/admin/Table/components/SearchPopup'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { DEFAULT_DATE_FORMAT, MODAL_TEXT } from '@/constants'
import { GET_PROFILE_OPTIONS } from '@/constants/baseQuery'
import {
  useDeleteUserMutation,
  useGetAllRolesQuery,
  useGetAllUsersQuery,
  useGetPrivateProfileQuery,
  useRestoreDeletedUserMutation,
  useUpdateUserRoleMutation
} from '@/services/user.service'
import { ColorConstant, ColumnsType, SelectionOptions } from '@/types/common'
import { RoleEnum } from '@/types/enum'
import { GetAllUsersQuery } from '@/types/query'
import { IUserInformation } from '@/types/user'
import { formatDate } from '@/utils/helpers.util'
import { EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import {
  Col,
  DatePicker,
  DescriptionsProps,
  Dropdown,
  MenuProps,
  PaginationProps,
  Row,
  Select,
  Tag,
  Typography
} from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useEffect, useMemo, useRef, useState } from 'react'
import { compareDates } from '../../../utils/helpers.util'
import { DELETE_USER_OPTIONS, MANAGE_USER_FIELDS } from './manage-user.const'
import './manage-user.scss'

export interface IManageUserProps {}

const { Text } = Typography
const { RangePicker } = DatePicker

const ORIGIN_PAGE = 1
const PAGE_SIZE = 20

const ACTIVE_FETCH = '1'
const DELETED_FETCH = '2'

const VIEW_DETAILS_OPTION = 1
const DECENTRALIZE_OPTION = 2
const RESTORE_OPTION = 2
const DELETE_OPTION = 3

// For search
type DataIndex = keyof IUserInformation

type SearchIndex = keyof GetAllUsersQuery

const ManageUser = (): React.ReactNode => {
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(ORIGIN_PAGE)

  // User data
  const [userOption, setUserOption] = useState<string>(ACTIVE_FETCH)
  const userOptionBoolean: boolean = useMemo<boolean>(() => userOption === DELETED_FETCH, [userOption])
  const [queryData, setQueryData] = useState<GetAllUsersQuery>({
    offset: currentPage,
    limit: PAGE_SIZE,
    isDeleted: userOptionBoolean
  } as GetAllUsersQuery)
  const { data: usersData, isFetching: isLoadingUsers } = useGetAllUsersQuery(queryData)
  const [selectedUser, setSelectedUser] = useState<IUserInformation | null>(null)

  // Modal
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refDecentralizeModal = useRef<IModalMethods | null>(null)
  const refRestoreModal = useRef<IModalMethods | null>(null)
  const refDeleteUserModal = useRef<IModalMethods | null>(null)

  // Other
  const [deleteUserMutation] = useDeleteUserMutation()
  const [updateUserRoleMutation] = useUpdateUserRoleMutation()
  const [restoreDeletedUserMutation] = useRestoreDeletedUserMutation()
  const { data: privateProfileData } = useGetPrivateProfileQuery(
    {
      userId: selectedUser?.id || '',
      userStatus: userOptionBoolean ? GET_PROFILE_OPTIONS.DELETED : GET_PROFILE_OPTIONS.ACTIVE
    },
    { skip: !selectedUser }
  )
  const { data: rolesData } = useGetAllRolesQuery()

  useEffect(() => {
    setQueryData(
      (prev) =>
        ({
          ...prev,
          offset: currentPage,
          isDeleted: userOptionBoolean
        }) as GetAllUsersQuery
    )
  }, [currentPage, userOptionBoolean])

  const handleModal = (selectedOpt: number): void => {
    if (selectedOpt === VIEW_DETAILS_OPTION) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === DECENTRALIZE_OPTION && userOptionBoolean === false) {
      refDecentralizeModal.current?.showModal()
    } else if (selectedOpt === RESTORE_OPTION && userOptionBoolean === true) {
      refRestoreModal.current?.showModal()
    } else if (selectedOpt === DELETE_OPTION) {
      refDeleteUserModal.current?.showModal()
    }
  }

  const onChangeSelection = (value: string): void => {
    setUserOption(value)
    setCurrentPage(ORIGIN_PAGE)
  }

  const mapQueryData = (_queryData: GetAllUsersQuery, dataIndex: DataIndex, value: string): GetAllUsersQuery => {
    const queryDataTemp =
      (dataIndex as string) === 'phoneNumber'
        ? ({ ..._queryData, phone: value } as GetAllUsersQuery)
        : ({ ..._queryData, [dataIndex]: value } as GetAllUsersQuery)
    return queryDataTemp
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
      setQueryData((prev) => mapQueryData(prev, dataIndex, selectedKeys[0]))
    }
  }

  const handleFilter = (
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
      setQueryData((prev) => ({ ...prev, [dataIndex]: selectedKeys }) as GetAllUsersQuery)
    }
  }

  const listColumns: ColumnsType<IUserInformation> = [
    {
      align: 'center',
      width: 75,
      onCell: (user: IUserInformation): React.HTMLAttributes<HTMLElement> => {
        return {
          onClick: (): void => {
            setSelectedUser(user)
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
          ...(userOption === ACTIVE_FETCH
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
                  onClick: (): void => handleModal(2)
                }
              ]),
          {
            key: 'Delete ',
            label: <span className={userOptionBoolean ? 'error-modal-title' : ''}>Delete</span>,
            icon: (
              <i
                className={`fa-regular fa-trash ${userOptionBoolean ? 'error-modal-title' : 'delete-icon'}`}
                style={{ fontSize: 15, cursor: 'pointer' }}
              ></i>
            ),
            onClick: (): void => handleModal(3)
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
      title: MANAGE_USER_FIELDS.firstName,
      dataIndex: 'firstName',
      key: 'firstName',
      width: 160,
      ...SearchPopupProps<IUserInformation, keyof IUserInformation>({
        dataIndex: 'firstName',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.lastName,
      dataIndex: 'lastName',
      key: 'lastName',
      width: 160,
      ...SearchPopupProps<IUserInformation, keyof IUserInformation>({
        dataIndex: 'lastName',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.email,
      dataIndex: 'email',
      key: 'email',
      ...SearchPopupProps<IUserInformation, keyof IUserInformation>({
        dataIndex: 'email',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.phoneNumber,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 200,
      ...SearchPopupProps<IUserInformation, keyof IUserInformation>({
        dataIndex: 'phoneNumber',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.created_at,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 200,
      render: (createdDate: string): React.ReactNode => {
        return <Text>{formatDate(createdDate)}</Text>
      },
      showSorterTooltip: false,
      sorter: {
        compare: (userA: IUserInformation, userB: IUserInformation) => compareDates(userA.created_at, userB.created_at)
      }
    },
    {
      title: MANAGE_USER_FIELDS.role,
      dataIndex: 'role',
      align: 'center',
      key: 'role',
      width: 250,
      render: (role: string): React.ReactNode => (
        <Tag color={generateRoleColor(role)} key={role} className='me-0'>
          {role.toUpperCase()}
        </Tag>
      ),
      ...FilterPopupProps<IUserInformation, keyof IUserInformation>({
        dataIndex: 'role',
        optionsData: rolesData as SelectionOptions[],
        _handleFilter: handleFilter
      })
    }
  ]

  const detailedItems: DescriptionsProps['items'] = [
    {
      label: MANAGE_USER_FIELDS.firstName,
      span: 2,
      children: privateProfileData?.firstName
    },
    {
      label: MANAGE_USER_FIELDS.lastName,
      span: 2,
      children: privateProfileData?.lastName
    },
    {
      label: MANAGE_USER_FIELDS.email,
      span: 4,
      children: privateProfileData?.email
    },
    {
      label: MANAGE_USER_FIELDS.phoneNumber,
      span: 4,
      children: privateProfileData?.phoneNumber
    },
    {
      label: MANAGE_USER_FIELDS.role,
      span: 2,
      children: (
        <Tag color={generateRoleColor(privateProfileData?.role || '')} key={privateProfileData?.role} className='me-0'>
          {privateProfileData?.role && privateProfileData?.role.toUpperCase()}
        </Tag>
      )
    },
    {
      label: MANAGE_USER_FIELDS.created_at,
      span: 2,
      children: formatDate(privateProfileData?.created_at || '')
    }
  ]

  const options = [
    {
      value: ACTIVE_FETCH,
      label: 'Active users'
    },
    {
      value: DELETED_FETCH,
      label: 'Deleted users'
    }
  ]

  const handleDecentralizeRole = (role: string): void => {
    updateUserRoleMutation({ role, id: selectedUser?.id ?? '' })
    refDecentralizeModal.current?.hideModal()
  }

  const handleDeleteUser = (): void => {
    deleteUserMutation({
      deleteType: userOptionBoolean ? DELETE_USER_OPTIONS.HARD : DELETE_USER_OPTIONS.SOFT,
      id: selectedUser?.id ?? ''
    })
    refDeleteUserModal.current?.hideModal()
  }

  const handleRestoreUser = (): void => {
    restoreDeletedUserMutation(selectedUser?.id ?? '')
    refRestoreModal.current?.hideModal()
  }

  const onChangePagination: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page)
  }

  const onChangeDatePicker: RangePickerProps['onChange'] = (_dates: unknown, dateStrings: [string, string]) => {
    if (dateStrings[0] === '' || dateStrings[1] === '') {
      setQueryData((prev) => {
        const queryTemp: GetAllUsersQuery = { ...prev }
        delete queryTemp.startDate
        delete queryTemp.endDate
        return { ...queryTemp } as GetAllUsersQuery
      })
    } else {
      setQueryData((prev) => ({ ...prev, startDate: dateStrings[0], endDate: dateStrings[1] }) as GetAllUsersQuery)
    }
  }

  return (
    <div className='--manage-user'>
      <Row className='pb-3'>
        <Col span={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
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

        <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>
            Total: <strong>{usersData?.totalRecords}</strong>
          </span>
        </Col>

        <Col span={6} className='d-flex justify-content-end'>
          <RangePicker format={DEFAULT_DATE_FORMAT} onChange={onChangeDatePicker} />
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
      <ViewRowDetailsModal
        title='User details'
        imageData={privateProfileData?.image}
        data={detailedItems}
        ref={refViewDetailsModal}
      />
      <DecentralizeModal
        selectionOptions={rolesData as SelectionOptions[]}
        presentOption={selectedUser?.role || ''}
        ref={refDecentralizeModal}
        title={'Decentralize'}
        specificInfo={
          <>
            <Text>{selectedUser?.email}</Text>
          </>
        }
        handleConfirm={handleDecentralizeRole}
      >
        <Text>Email:</Text>
        <Text>Role:</Text>
      </DecentralizeModal>

      <RestoreModal
        title={MODAL_TEXT.RESTORE_USER_TITLE}
        content={
          <>
            <Text className='d-inline'>{MODAL_TEXT.RESTORE_USER}</Text>
            {' ('}
            <Text className='d-inline' strong>
              {selectedUser?.email}
            </Text>{' '}
            {')'}
          </>
        }
        handleConfirm={handleRestoreUser}
        ref={refRestoreModal}
      />

      <DeleteModal
        title={MODAL_TEXT.DELETE_USER_TITLE}
        content={
          <>
            <Text className='d-inline' strong type={userOptionBoolean ? 'danger' : undefined}>
              {userOptionBoolean ? MODAL_TEXT.DELETE_USER_PERMANENT : MODAL_TEXT.DELETE_USER_TEMPORARY}
            </Text>
            {' ('}
            <Text className='d-inline' strong>
              {selectedUser?.email}
            </Text>{' '}
            {')'}
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
