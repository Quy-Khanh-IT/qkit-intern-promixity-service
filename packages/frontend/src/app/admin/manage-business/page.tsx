'use client'
import ModerateModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import { default as DeleteModal, default as RestoreModal } from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'
import FilterPopupProps from '@/app/components/admin/Table/components/FilterPopup'
import SearchPopupProps from '@/app/components/admin/Table/components/SearchPopup'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { DEFAULT_DATE_FORMAT, MODAL_TEXT, PLACEHOLDER } from '@/constants'
import variables from '@/sass/common/_variables.module.scss'
import {
  useDeleteBusinessMutation,
  useGetAllBusinessActionsQuery,
  useGetAllBusinessesQuery,
  useGetAllBusinessStatusQuery,
  useGetPrivateBusinessProfileQuery,
  useRestoreDeletedBusinessMutation,
  useUpdateBusinessStatusMutation
} from '@/services/business.service'
import { IBusiness } from '@/types/business'
import { ColorConstant, ColumnsType, IOptionsPipe, SelectionOptions } from '@/types/common'
import { StatusEnum } from '@/types/enum'
import { IGetAllBusinessQuery } from '@/types/query'
import { compareDates, formatDate } from '@/utils/helpers.util'
import { EllipsisOutlined, FolderViewOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import {
  Col,
  DatePicker,
  DescriptionsProps,
  Dropdown,
  Flex,
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
import { DELETE_OPTIONS } from '../admin.constant'
import { MANAGE_BUSINESS_FIELDS } from './manage-business.const'
import './manage-business.scss'

const { Text } = Typography
const { starColor } = variables
const { RangePicker } = DatePicker

const ORIGIN_PAGE = 1
const PAGE_SIZE = 20

const ACTIVE_FETCH = '1'
const DELETED_FETCH = '2'

const VIEW_DETAILS_OPTION = 1
const MODERATE_OPTION = 2
const RESTORE_OPTION = 2
const DELETE_OPTION = 3

type DataIndex = keyof IBusiness
// For search
type SearchIndex = keyof IGetAllBusinessQuery

const ManageBusiness = (): React.ReactNode => {
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(ORIGIN_PAGE)

  // User data
  const [businessOption, setBusinessOption] = useState<string>(ACTIVE_FETCH)
  const businessOptionBoolean: boolean = useMemo<boolean>(() => businessOption === DELETED_FETCH, [businessOption])
  const [queryData, setQueryData] = useState<IGetAllBusinessQuery>({
    offset: currentPage,
    limit: PAGE_SIZE,
    isDeleted: businessOptionBoolean
  } as IGetAllBusinessQuery)
  const { data: businessesData, isFetching: isLoadingBusinesses } = useGetAllBusinessesQuery(queryData)
  const [selectedBusiness, setSelectedBusiness] = useState<IBusiness | null>(null)

  // Modal
  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refModerateModal = useRef<IModalMethods | null>(null)
  const refRestoreModal = useRef<IModalMethods | null>(null)
  const refDeleteBusinessModal = useRef<IModalMethods | null>(null)

  // Other
  const [deleteBusinessMutation] = useDeleteBusinessMutation()
  const [updateBusinessStatusMutation] = useUpdateBusinessStatusMutation()
  const [restoreDeletedBusinessMutation] = useRestoreDeletedBusinessMutation()
  const { data: privateProfileData } = useGetPrivateBusinessProfileQuery(selectedBusiness?.id || '', {
    skip: !selectedBusiness
  })
  const { data: statusData } = useGetAllBusinessStatusQuery()
  const { data: actionsData } = useGetAllBusinessActionsQuery()

  useEffect(() => {
    setQueryData(
      (prev) =>
        ({
          ...prev,
          offset: currentPage,
          isDeleted: businessOptionBoolean
        }) as IGetAllBusinessQuery
    )
  }, [currentPage, businessOptionBoolean])

  const handleModal = (selectedOpt: number): void => {
    if (selectedOpt === VIEW_DETAILS_OPTION) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === MODERATE_OPTION && businessOptionBoolean === false) {
      refModerateModal.current?.showModal()
    } else if (selectedOpt === RESTORE_OPTION && businessOptionBoolean === true) {
      refRestoreModal.current?.showModal()
    } else if (selectedOpt === DELETE_OPTION) {
      refDeleteBusinessModal.current?.showModal()
    }
  }

  const onChangeSelection = (value: string): void => {
    setBusinessOption(value)
    setCurrentPage(ORIGIN_PAGE)
  }

  const mapQueryData = (
    _queryData: IGetAllBusinessQuery,
    dataIndex: DataIndex,
    value: string
  ): IGetAllBusinessQuery => {
    const queryDataTemp =
      (dataIndex as string) === 'phoneNumber'
        ? ({ ..._queryData, phone: value } as IGetAllBusinessQuery)
        : ({ ..._queryData, [dataIndex]: value } as IGetAllBusinessQuery)
    return queryDataTemp
  }

  const handleSearch = (
    selectedKeys: string[],
    _confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ): void => {
    if (selectedKeys.length === 0) {
      setQueryData((prev) => {
        const queryTemp: IGetAllBusinessQuery = { ...prev }
        delete queryTemp[dataIndex as SearchIndex]
        return { ...queryTemp } as IGetAllBusinessQuery
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
        const queryTemp: IGetAllBusinessQuery = { ...prev }
        delete queryTemp[dataIndex as SearchIndex]
        return { ...queryTemp } as IGetAllBusinessQuery
      })
    } else {
      setQueryData((prev) => ({ ...prev, [dataIndex]: selectedKeys }) as IGetAllBusinessQuery)
    }
  }

  const listColumns: ColumnsType<IBusiness> = [
    {
      align: 'center',
      width: 75,
      onCell: (business: IBusiness): React.HTMLAttributes<HTMLElement> => {
        return {
          onClick: (): void => {
            setSelectedBusiness(business)
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
          ...(businessOption === ACTIVE_FETCH
            ? [
                {
                  key: 'Moderate',
                  label: <span>Moderate</span>,
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
            label: <span className={businessOptionBoolean ? 'error-modal-title' : ''}>Delete</span>,
            icon: (
              <i
                className={`fa-regular fa-trash ${businessOptionBoolean ? 'error-modal-title' : 'delete-icon'}`}
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
      title: MANAGE_BUSINESS_FIELDS.name,
      dataIndex: 'name',
      key: 'name',
      width: 160,
      ...SearchPopupProps<IBusiness, keyof IBusiness>({
        dataIndex: 'name',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_BUSINESS_FIELDS.category,
      dataIndex: 'categoryName',
      key: 'category',
      width: 150,
      ...SearchPopupProps<IBusiness, keyof IBusiness>({
        dataIndex: 'categoryName',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_BUSINESS_FIELDS.fullAddress,
      dataIndex: 'fullAddress',
      key: 'fullAddress',
      ...SearchPopupProps<IBusiness, keyof IBusiness>({
        dataIndex: 'fullAddress',
        _handleSearch: handleSearch
      })
    },
    {
      title: MANAGE_BUSINESS_FIELDS.totalReview,
      dataIndex: 'totalReview',
      align: 'center',
      key: 'totalReview',
      width: 150,
      showSorterTooltip: false,
      sorter: {
        compare: (a, b) => a.totalReview - b.totalReview,
        multiple: 2 // higher priority
      }
    },
    {
      title: 'Rating',
      dataIndex: 'overallRating',
      align: 'center',
      key: 'overallRating',
      width: 150,
      render: (avgRating: number) => (
        <Flex justify='center' align='center'>
          <Typography.Text style={{ width: 40, textAlign: 'end' }}>{avgRating}</Typography.Text>
          <i className='fa-solid fa-star ms-2' style={{ color: starColor }}></i>
        </Flex>
      ),
      showSorterTooltip: false,
      sorter: {
        compare: (a, b) => a.overallRating - b.overallRating,
        multiple: 1
      },
      ...FilterPopupProps<IBusiness, keyof IBusiness>({
        dataIndex: 'overallRating',
        optionsData: statusData as IOptionsPipe,
        _handleFilter: handleFilter
      })
    },
    {
      title: MANAGE_BUSINESS_FIELDS.created_at,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (createdDate: string): React.ReactNode => {
        return <Text>{formatDate(createdDate)}</Text>
      },
      showSorterTooltip: false,
      sorter: {
        compare: (businessA: IBusiness, businessB: IBusiness) =>
          compareDates(businessA.created_at, businessB.created_at)
      }
    },
    {
      title: MANAGE_BUSINESS_FIELDS.status,
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: 150,
      render: (status: string): React.ReactNode => (
        <Tag color={generateStatusColor(status)} key={status} className='me-0'>
          {status.toUpperCase()}
        </Tag>
      ),
      ...FilterPopupProps<IBusiness, keyof IBusiness>({
        dataIndex: 'status',
        optionsData: statusData as IOptionsPipe,
        _handleFilter: handleFilter
      })
    }
  ]

  const detailedItems: DescriptionsProps['items'] = [
    {
      label: MANAGE_BUSINESS_FIELDS.name,
      span: 4,
      children: privateProfileData?.name
    },
    {
      label: MANAGE_BUSINESS_FIELDS.description,
      span: 2,
      children: privateProfileData?.description || PLACEHOLDER.EMPTY_TEXT
    },
    {
      label: MANAGE_BUSINESS_FIELDS.website,
      span: 4,
      children: privateProfileData?.website
    },
    {
      label: MANAGE_BUSINESS_FIELDS.fullAddress,
      span: 4,
      children: privateProfileData?.fullAddress
    },
    {
      label: MANAGE_BUSINESS_FIELDS.category,
      span: 2,
      children: privateProfileData?.category.name
    },
    {
      label: MANAGE_BUSINESS_FIELDS.phoneNumber,
      span: 2,
      children: privateProfileData?.phoneNumber
    },
    {
      label: MANAGE_BUSINESS_FIELDS.services,
      span: 4,
      children: privateProfileData?.services.join(', ')
    },
    {
      label: MANAGE_BUSINESS_FIELDS.totalReview,
      span: 2,
      children: privateProfileData?.totalReview
    },
    {
      label: MANAGE_BUSINESS_FIELDS.overallRating,
      span: 2,
      children: privateProfileData?.overallRating
    },
    {
      label: MANAGE_BUSINESS_FIELDS.status,
      span: 2,
      children: (
        <Tag
          color={generateStatusColor(privateProfileData?.status || '')}
          key={privateProfileData?.status}
          className='me-0'
        >
          {privateProfileData?.status && privateProfileData?.status.toUpperCase()}
        </Tag>
      )
    },
    {
      label: MANAGE_BUSINESS_FIELDS.created_at,
      span: 2,
      children: formatDate(privateProfileData?.created_at || '')
    }
    // date of week & images
  ]

  const options = [
    {
      value: ACTIVE_FETCH,
      label: 'Active businesses'
    },
    {
      value: DELETED_FETCH,
      label: 'Deleted businesses'
    }
  ]

  const handleDecentralizeRole = (type: string): void => {
    updateBusinessStatusMutation({ type, id: selectedBusiness?.id ?? '' })
    refModerateModal.current?.hideModal()
  }

  const handleDeleteBusiness = (): void => {
    deleteBusinessMutation({
      type: businessOptionBoolean ? DELETE_OPTIONS.HARD : DELETE_OPTIONS.SOFT,
      id: selectedBusiness?.id ?? ''
    })
    refDeleteBusinessModal.current?.hideModal()
  }

  const handleRestoreBusiness = (): void => {
    restoreDeletedBusinessMutation(selectedBusiness?.id ?? '')
    refRestoreModal.current?.hideModal()
  }

  const onChangePagination: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page)
  }

  const onChangeDatePicker: RangePickerProps['onChange'] = (_dates: unknown, dateStrings: [string, string]) => {
    if (dateStrings[0] === '' || dateStrings[1] === '') {
      setQueryData((prev) => {
        const queryTemp: IGetAllBusinessQuery = { ...prev }
        delete queryTemp.startDate
        delete queryTemp.endDate
        return { ...queryTemp } as IGetAllBusinessQuery
      })
    } else {
      setQueryData((prev) => ({ ...prev, startDate: dateStrings[0], endDate: dateStrings[1] }) as IGetAllBusinessQuery)
    }
  }

  return (
    <div className='--manage-business'>
      <Row className='pb-3'>
        <Col span={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={20} sm={16} md={14} lg={10} xl={6}>
            <Select
              onChange={onChangeSelection}
              optionFilterProp='children'
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
              className='filter-select w-100'
              value={businessOption}
              options={options}
            />
          </Col>
        </Col>

        <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>
            Total: <strong>{businessesData?.totalRecords ?? 0}</strong>
          </span>
        </Col>

        <Col span={6} className='d-flex justify-content-end'>
          <RangePicker format={DEFAULT_DATE_FORMAT} onChange={onChangeDatePicker} />
        </Col>
      </Row>

      <TableComponent
        isFetching={isLoadingBusinesses}
        columns={listColumns}
        dataSource={businessesData?.data ?? []}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: businessesData?.totalRecords ?? 0,
          onChange: onChangePagination
        }}
        className='--manage-business-table'
      />
      <ViewRowDetailsModal
        title='Business details'
        // imageData={privateProfileData?.image}
        data={detailedItems}
        ref={refViewDetailsModal}
      />
      <ModerateModal
        selectionOptions={actionsData as SelectionOptions[]}
        presentOption={selectedBusiness?.status || ''}
        ref={refModerateModal}
        title={'Decentralize'}
        specificInfo={
          <>
            <Text>
              {selectedBusiness?.name}
              {selectedBusiness?.website && '-' + selectedBusiness?.website}
            </Text>
          </>
        }
        handleConfirm={handleDecentralizeRole}
      >
        <Text>Email:</Text>
        <Text>Role:</Text>
      </ModerateModal>

      <RestoreModal
        title={MODAL_TEXT.RESTORE_USER_TITLE}
        content={
          <>
            <Text className='d-inline'>{MODAL_TEXT.RESTORE_USER}</Text>
            {' ('}
            <Text className='d-inline' strong>
              {selectedBusiness?.name}
              {selectedBusiness?.website && '-' + selectedBusiness?.website}
            </Text>{' '}
            {')'}
          </>
        }
        handleConfirm={handleRestoreBusiness}
        ref={refRestoreModal}
      />

      <DeleteModal
        title={MODAL_TEXT.DELETE_USER_TITLE}
        content={
          <>
            <Text className='d-inline' strong type={businessOptionBoolean ? 'danger' : undefined}>
              {businessOptionBoolean ? MODAL_TEXT.DELETE_USER_PERMANENT : MODAL_TEXT.DELETE_USER_TEMPORARY}
            </Text>
            {' ('}
            <Text className='d-inline' strong>
              {selectedBusiness?.name}
              {selectedBusiness?.website && '-' + selectedBusiness?.website}
            </Text>{' '}
            {')'}
          </>
        }
        handleConfirm={handleDeleteBusiness}
        ref={refDeleteBusinessModal}
      />
    </div>
  )
}

export default ManageBusiness

const generateStatusColor = (role: string): string => {
  let color: string = ColorConstant._PINK

  if (role === (StatusEnum._APPROVED as string)) {
    color = ColorConstant._GREEN
  } else if (role === (StatusEnum._PENDING as string)) {
    color = ColorConstant._GEEK_BLUE
  } else if (role === (StatusEnum._REJECTED as string)) {
    color = ColorConstant._GOLD
  } else if (role === (StatusEnum._BANNED as string)) {
    color = ColorConstant._RED
  } else if (role === (StatusEnum._CLOSED as string)) {
    color = ColorConstant._GREY
  }

  return color
}
