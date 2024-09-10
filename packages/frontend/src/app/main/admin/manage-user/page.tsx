'use client'
import { default as DeleteModal, default as RestoreModal } from '@/app/components/admin/ConfirmModal/ConfirmModal'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import FilterPopupProps from '@/app/components/admin/Table/components/FilterPopup'
import SearchPopupProps from '@/app/components/admin/Table/components/SearchPopup'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { DEFAULT_DATE_FORMAT, MODAL_TEXT, PLACEHOLDER, ROUTE, StorageKey } from '@/constants'
import { RootState } from '@/redux/store'
import {
  useDeleteUserMutation,
  useGetAllRolesQuery,
  useGetAllUsersQuery,
  useGetPrivateUserProfileQuery,
  useRestoreDeletedUserMutation,
  useUpdateUserRoleMutation
} from '@/services/user.service'
import { ColumnsType, IOptionsPipe } from '@/types/common'
import { TableActionEnum, UserOptionEnum } from '@/types/enum'
import { IModalMethods } from '@/types/modal'
import { IGetAllUsersQuery } from '@/types/query'
import { IUserInformation } from '@/types/user'
import { compareDates, convertSortOrder, formatDate, parseSearchParamsToObject } from '@/utils/helpers.util'
import { getFromSessionStorage, saveToSessionStorage } from '@/utils/session-storage.util'
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
  TableProps,
  Tag,
  Typography
} from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import {
  FilterDropdownProps,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig
} from 'antd/es/table/interface'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DELETE_OPTIONS } from '../../admin.constant'
import { generateRoleColor } from '../../utils/main.util'
import { MANAGE_USER_FIELDS } from './manage-user.const'
import './manage-user.scss'

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

type DataIndex = keyof IUserInformation
// For search
type SearchIndex = keyof IGetAllUsersQuery

const ORIGIN_DATA = {
  offset: ORIGIN_PAGE,
  limit: PAGE_SIZE
} as IGetAllUsersQuery

const ManageUser = (): React.ReactNode => {
  const router = useRouter()
  const currentPathName = usePathname()
  // Search
  const searchParams = useSearchParams()
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(ORIGIN_PAGE)

  // User data
  const [userOption, setUserOption] = useState<string>(ACTIVE_FETCH)
  const userOptionBoolean: boolean = useMemo<boolean>(() => userOption === DELETED_FETCH, [userOption])
  const [queryData, setQueryData] = useState<IGetAllUsersQuery>({
    offset: currentPage,
    limit: PAGE_SIZE,
    isDeleted: userOptionBoolean
  } as IGetAllUsersQuery)

  const { data: usersData, isFetching: isLoadingUsers } = useGetAllUsersQuery(
    parseSearchParamsToObject(searchParams.toString()) as IGetAllUsersQuery
  )
  const [selectedUser, setSelectedUser] = useState<IUserInformation | null>(null)

  // Modal
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refDecentralizeModal = useRef<IModalMethods | null>(null)
  const refRestoreModal = useRef<IModalMethods | null>(null)
  const refDeleteUserModal = useRef<IModalMethods | null>(null)

  // Redux
  const sidebarTabState = useSelector((state: RootState) => state.selectedSidebarTab.sidebarTabState)

  // Other
  const [deleteUserMutation] = useDeleteUserMutation()
  const [updateUserRoleMutation] = useUpdateUserRoleMutation()
  const [restoreDeletedUserMutation] = useRestoreDeletedUserMutation()
  const { data: privateProfileData } = useGetPrivateUserProfileQuery(
    {
      userId: selectedUser?.id || '',
      userStatus: userOptionBoolean ? UserOptionEnum._DELETED : UserOptionEnum._ACTIVE
    },
    { skip: !selectedUser }
  )
  const { data: rolesData } = useGetAllRolesQuery()

  useEffect(() => {
    setQueryData(
      (_prev) =>
        ({
          ...ORIGIN_DATA,
          isDeleted: userOptionBoolean
        }) as IGetAllUsersQuery
    )
  }, [sidebarTabState])

  useEffect(() => {
    const routeTemp = getFromSessionStorage(StorageKey._ROUTE_VALUE)
    const storedPathName: string = routeTemp ? (routeTemp as string) : ROUTE.MANAGE_USER
    const storedQueryValue: IGetAllUsersQuery = parseSearchParamsToObject(storedPathName.split('?')[1])
    storedQueryValue.limit = PAGE_SIZE
    setQueryData(storedQueryValue)
  }, [])

  useEffect(() => {
    const queryString = qs.stringify(queryData, { arrayFormat: 'repeat' })
    const params = new URLSearchParams(queryString).toString()

    const newPathname = `${currentPathName}?${params}`
    router.push(newPathname)
    saveToSessionStorage(StorageKey._ROUTE_VALUE, newPathname)
  }, [queryData])

  useEffect(() => {
    setQueryData(
      (prev) =>
        ({
          ...prev,
          offset: currentPage,
          isDeleted: userOptionBoolean
        }) as IGetAllUsersQuery
    )
  }, [currentPage])

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
    setQueryData(
      (_prev) =>
        ({
          ...ORIGIN_DATA,
          isDeleted: value === DELETED_FETCH
        }) as IGetAllUsersQuery
    )
    setCurrentPage(ORIGIN_PAGE)
  }

  const mapQueryData = (
    _queryData: IGetAllUsersQuery,
    dataIndex: DataIndex,
    values: string[] | string,
    _action?: string
  ): IGetAllUsersQuery => {
    let queryDataTemp = {} as IGetAllUsersQuery
    if ((dataIndex as string) === 'phoneNumber') {
      queryDataTemp = { ..._queryData, phone: values } as IGetAllUsersQuery
    } else if ((dataIndex as string) === 'created_at') {
      queryDataTemp = { ..._queryData, sortBy: values } as IGetAllUsersQuery
    } else {
      queryDataTemp = { ..._queryData, [dataIndex]: values } as IGetAllUsersQuery
    }
    return queryDataTemp
  }

  const deleteUnSelectedField = (_queryData: IGetAllUsersQuery, dataIndex: DataIndex): IGetAllUsersQuery => {
    const queryDataTemp = { ..._queryData } as IGetAllUsersQuery
    if ((dataIndex as string) === 'phoneNumber') {
      delete queryDataTemp.phone
    } else if ((dataIndex as string) === 'created_at') {
      delete queryDataTemp.sortBy
    } else {
      delete queryDataTemp[dataIndex as SearchIndex]
    }
    return queryDataTemp
  }

  const handleSearch = (
    selectedKeys: string[],
    _confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ): void => {
    if (selectedKeys.length === 0) {
      setQueryData((prev) => {
        const queryTemp: IGetAllUsersQuery = deleteUnSelectedField(prev, dataIndex)
        return { ...queryTemp } as IGetAllUsersQuery
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
        const queryTemp: IGetAllUsersQuery = deleteUnSelectedField(prev, dataIndex)
        return { ...queryTemp } as IGetAllUsersQuery
      })
    } else {
      setQueryData((prev) => mapQueryData(prev, dataIndex, selectedKeys))
    }
  }

  const onChangeSorter: TableProps<IUserInformation>['onChange'] = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IUserInformation> | SorterResult<IUserInformation>[],
    extra: TableCurrentDataSource<IUserInformation>
  ) => {
    if (extra?.action === (TableActionEnum._SORT as string)) {
      const updateQueryData = (sorterItem: SorterResult<IUserInformation>): void => {
        if (sorterItem?.order) {
          setQueryData((prev) =>
            mapQueryData(
              prev,
              sorterItem?.columnKey as DataIndex,
              convertSortOrder(sorterItem?.order as string),
              extra?.action
            )
          )
        } else {
          setQueryData((prev) => {
            const queryTemp: IGetAllUsersQuery = deleteUnSelectedField(prev, sorterItem?.columnKey as DataIndex)
            return { ...queryTemp } as IGetAllUsersQuery
          })
        }
      }

      if (!Array.isArray(sorter)) {
        updateQueryData(sorter)
      } else {
        sorter.forEach(updateQueryData)
      }
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
      ...SearchPopupProps<IUserInformation, DataIndex>({
        dataIndex: 'firstName',
        placeholder: MANAGE_USER_FIELDS.firstName,
        defaultValue: queryData?.firstName ? [queryData?.firstName] : [],
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.lastName,
      dataIndex: 'lastName',
      key: 'lastName',
      width: 160,
      ...SearchPopupProps<IUserInformation, DataIndex>({
        dataIndex: 'lastName',
        placeholder: MANAGE_USER_FIELDS.lastName,
        defaultValue: queryData?.lastName ? [queryData?.lastName] : [],
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.email,
      dataIndex: 'email',
      key: 'email',
      ...SearchPopupProps<IUserInformation, DataIndex>({
        dataIndex: 'email',
        placeholder: MANAGE_USER_FIELDS.email,
        defaultValue: queryData?.email ? [queryData?.email] : [],
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_USER_FIELDS.phoneNumber,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 200,
      ...SearchPopupProps<IUserInformation, DataIndex>({
        dataIndex: 'phoneNumber',
        placeholder: MANAGE_USER_FIELDS.phoneNumber,
        defaultValue: queryData?.phone ? [queryData?.phone] : [],
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
          {role?.toUpperCase()}
        </Tag>
      ),
      ...FilterPopupProps<IUserInformation, DataIndex>({
        defaultValue: queryData?.role || [],
        dataIndex: 'role',
        optionsData: rolesData as IOptionsPipe,
        _handleFilter: handleFilter
      })
    }
  ]

  const detailedItems: DescriptionsProps['items'] = [
    {
      label: MANAGE_USER_FIELDS.firstName,
      span: 2,
      children: privateProfileData?.firstName || PLACEHOLDER.EMPTY_TEXT
    },
    {
      label: MANAGE_USER_FIELDS.lastName,
      span: 2,
      children: privateProfileData?.lastName || PLACEHOLDER.EMPTY_TEXT
    },
    {
      label: MANAGE_USER_FIELDS.email,
      span: 4,
      children: privateProfileData?.email || PLACEHOLDER.EMPTY_TEXT
    },
    {
      label: MANAGE_USER_FIELDS.phoneNumber,
      span: 4,
      children: privateProfileData?.phoneNumber || PLACEHOLDER.EMPTY_TEXT
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
      deleteType: userOptionBoolean ? DELETE_OPTIONS.HARD : DELETE_OPTIONS.SOFT,
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
        const queryTemp: IGetAllUsersQuery = { ...prev }
        delete queryTemp.startDate
        delete queryTemp.endDate
        return { ...queryTemp } as IGetAllUsersQuery
      })
    } else {
      setQueryData((prev) => ({ ...prev, startDate: dateStrings[0], endDate: dateStrings[1] }) as IGetAllUsersQuery)
    }
  }

  return (
    <div className='--manage-user'>
      <Row className='mb-3' style={{ height: 36 }}>
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
        _onChange={onChangeSorter}
        className='--manage-user-table'
      />
      <ViewRowDetailsModal
        title='User details'
        imageData={privateProfileData?.image}
        data={detailedItems}
        ref={refViewDetailsModal}
      />
      <DecentralizeModal
        selectionOptions={rolesData?.selectionOpts || []}
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
            </Text>
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
