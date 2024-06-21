'use client'
import FilterPopupProps from '@/app/components/admin/Table/components/FilterPopup'
import SearchPopupProps from '@/app/components/admin/Table/components/SearchPopup'
import { default as DeleteModal, default as RestoreModal } from '@/app/components/admin/ConfirmModal/ConfirmModal'
import TableComponent from '@/app/components/admin/Table/Table'
import { DEFAULT_DATE_FORMAT, MODAL_TEXT, ROUTE, StorageKey } from '@/constants'
import { RootState } from '@/redux/store'
import variables from '@/sass/common/_variables.module.scss'
import {
  useDeleteReviewByIdMutation,
  useGetReviewsForAdminQuery,
  useRestoreReviewByIdMutation
} from '@/services/review.service'
import { ColumnsType } from '@/types/common'
import { TableActionEnum } from '@/types/enum'
import { IGetAllReviewOfAdminQuery } from '@/types/query'
import { IReview } from '@/types/review'
import { compareDates, convertSortOrder, formatDate, parseSearchParamsToObject } from '@/utils/helpers.util'
import { getFromSessionStorage, saveToSessionStorage } from '@/utils/session-storage.util'
import { EllipsisOutlined, FolderViewOutlined } from '@ant-design/icons'
import { Col, DatePicker, Dropdown, Flex, MenuProps, PaginationProps, Row, Select, TableProps, Typography } from 'antd'
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
import { DELETE_OPTIONS, RATING_OPTIONS_FILTERS, RATING_SELECT_FILTERS } from '../../admin.constant'
import { MANAGE_REVIEW_FIELDS } from './manage-review.const'
import { UndoOutlined } from '@ant-design/icons'
import './manage-review.scss'
import { IModalMethods } from '@/types/modal'

const { starColor } = variables

const { Text } = Typography
const { RangePicker } = DatePicker

const ORIGIN_PAGE = 1
const PAGE_SIZE = 20

const ACTIVE_FETCH = '1'
const DELETED_FETCH = '2'

const VIEW_DETAILS_OPTION = 1
const RESTORE_OPTION = 2
const DELETE_OPTION = 3

type DataIndex = keyof IReview
// For search
type SearchIndex = keyof IGetAllReviewOfAdminQuery

const ORIGIN_DATA = {
  offset: ORIGIN_PAGE,
  limit: PAGE_SIZE
} as IGetAllReviewOfAdminQuery

const ManageReview = (): React.ReactNode => {
  const router = useRouter()
  const currentPathName = usePathname()
  // Search
  const searchParams = useSearchParams()
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(ORIGIN_PAGE)

  // Review data
  const [reviewOption, setReviewOption] = useState<string>(ACTIVE_FETCH)
  const reviewOptionBoolean: boolean = useMemo<boolean>(() => reviewOption === DELETED_FETCH, [reviewOption])
  const [queryData, setQueryData] = useState<IGetAllReviewOfAdminQuery>({
    offset: currentPage,
    limit: PAGE_SIZE,
    isDeleted: reviewOptionBoolean
  } as IGetAllReviewOfAdminQuery)

  const { data: reviewsData, isFetching: isLoadingReviews } = useGetReviewsForAdminQuery(
    parseSearchParamsToObject(searchParams.toString()) as IGetAllReviewOfAdminQuery
  )
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null)

  // Redux
  const sidebarTabState = useSelector((state: RootState) => state.selectedSidebarTab.sidebarTabState)

  // Modal
  const refRestoreModal = useRef<IModalMethods | null>(null)
  const refDeleteReviewModal = useRef<IModalMethods | null>(null)

  // Other
  const [deleteReviewMutation] = useDeleteReviewByIdMutation()
  const [restoreDeletedReviewMutation] = useRestoreReviewByIdMutation()

  useEffect(() => {
    setQueryData(
      (_prev) =>
        ({
          ...ORIGIN_DATA,
          isDeleted: reviewOptionBoolean
        }) as IGetAllReviewOfAdminQuery
    )
  }, [sidebarTabState])

  useEffect(() => {
    const routeTemp = getFromSessionStorage(StorageKey._ROUTE_VALUE)
    const storedPathName: string = routeTemp ? (routeTemp as string) : ROUTE.MANAGE_USER
    const storedQueryValue: IGetAllReviewOfAdminQuery = parseSearchParamsToObject(storedPathName.split('?')[1])
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
          isDeleted: reviewOptionBoolean
        }) as IGetAllReviewOfAdminQuery
    )
  }, [currentPage])

  const handleModal = (selectedOpt: number): void => {
    if (selectedOpt === VIEW_DETAILS_OPTION) {
      router.push(`${ROUTE.MANAGE_REVIEW}/${selectedReview?.id}`)
    } else if (selectedOpt === RESTORE_OPTION && reviewOptionBoolean === true) {
      refRestoreModal.current?.showModal()
    } else if (selectedOpt === DELETE_OPTION) {
      refDeleteReviewModal.current?.showModal()
    }
  }

  const onChangeSelection = (value: string): void => {
    setReviewOption(value)
    setQueryData(
      (_prev) =>
        ({
          ...ORIGIN_DATA,
          isDeleted: value === DELETED_FETCH
        }) as IGetAllReviewOfAdminQuery
    )
    setCurrentPage(ORIGIN_PAGE)
  }

  const mapQueryData = (
    _queryData: IGetAllReviewOfAdminQuery,
    dataIndex: DataIndex,
    values: string[] | string,
    _action?: string
  ): IGetAllReviewOfAdminQuery => {
    let queryDataTemp = {} as IGetAllReviewOfAdminQuery
    if ((dataIndex as string) === 'phoneNumber') {
      queryDataTemp = { ..._queryData, phone: values } as IGetAllReviewOfAdminQuery
    } else if ((dataIndex as string) === 'created_at') {
      queryDataTemp = { ..._queryData, sortBy: values } as IGetAllReviewOfAdminQuery
    } else {
      queryDataTemp = { ..._queryData, [dataIndex]: values } as IGetAllReviewOfAdminQuery
    }
    return queryDataTemp
  }

  const deleteUnSelectedField = (
    _queryData: IGetAllReviewOfAdminQuery,
    dataIndex: DataIndex
  ): IGetAllReviewOfAdminQuery => {
    const queryDataTemp = { ..._queryData } as IGetAllReviewOfAdminQuery
    if ((dataIndex as string) === 'star') {
      delete queryDataTemp.starsRating
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
        const queryTemp: IGetAllReviewOfAdminQuery = deleteUnSelectedField(prev, dataIndex)
        return { ...queryTemp } as IGetAllReviewOfAdminQuery
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
        const queryTemp: IGetAllReviewOfAdminQuery = deleteUnSelectedField(prev, dataIndex)
        return { ...queryTemp } as IGetAllReviewOfAdminQuery
      })
    } else {
      setQueryData((prev) => mapQueryData(prev, dataIndex, selectedKeys))
    }
  }

  const onChangeSorter: TableProps<IReview>['onChange'] = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IReview> | SorterResult<IReview>[],
    extra: TableCurrentDataSource<IReview>
  ) => {
    if (extra?.action === (TableActionEnum._SORT as string)) {
      const updateQueryData = (sorterItem: SorterResult<IReview>): void => {
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
            const queryTemp: IGetAllReviewOfAdminQuery = deleteUnSelectedField(prev, sorterItem?.columnKey as DataIndex)
            return { ...queryTemp } as IGetAllReviewOfAdminQuery
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

  const listColumns: ColumnsType<IReview> = [
    {
      align: 'center',
      width: 75,
      onCell: (review: IReview): React.HTMLAttributes<HTMLElement> => {
        return {
          onClick: (): void => {
            setSelectedReview(review)
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
          ...(reviewOption === ACTIVE_FETCH
            ? []
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
            label: <span className={reviewOptionBoolean ? 'error-modal-title' : ''}>Delete</span>,
            icon: (
              <i
                className={`fa-regular fa-trash ${reviewOptionBoolean ? 'error-modal-title' : 'delete-icon'}`}
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
      title: MANAGE_REVIEW_FIELDS.firstName,
      dataIndex: ['postBy', 'firstName'],
      key: 'firstName',
      width: 160
      // ...SearchPopupProps<IReview, DataIndex>({
      //   dataIndex: 'firstName',
      //   placeholder: MANAGE_REVIEW_FIELDS.firstName,
      //   defaultValue: queryData?.firstName ? [queryData?.firstName] : [],
      //   _handleSearch: handleSearch
      // })
    },
    {
      title: MANAGE_REVIEW_FIELDS.lastName,
      dataIndex: ['postBy', 'lastName'],
      key: 'lastName',
      width: 160
      // ...SearchPopupProps<IReview, DataIndex>({
      //   dataIndex: 'lastName',
      //   placeholder: MANAGE_REVIEW_FIELDS.lastName,
      //   defaultValue: queryData?.lastName ? [queryData?.lastName] : [],
      //   _handleSearch: handleSearch
      // })
    },
    {
      title: MANAGE_REVIEW_FIELDS.content,
      dataIndex: 'content',
      key: 'content',
      ...SearchPopupProps<IReview, DataIndex>({
        dataIndex: 'content',
        placeholder: MANAGE_REVIEW_FIELDS.content,
        defaultValue: queryData?.content ? [queryData?.content] : [],
        _handleSearch: handleSearch
      })
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      align: 'center',
      key: 'star',
      width: 150,
      render: (avgRating: number) => (
        <Flex justify='center' align='center'>
          <Typography.Text style={{ width: 30, textAlign: 'end' }}>{avgRating}</Typography.Text>
          <i className='fa-solid fa-star ms-2' style={{ color: starColor }}></i>
        </Flex>
      ),
      showSorterTooltip: false,
      sorter: {
        compare: (businessA: IReview, businessB: IReview) => businessA.star - businessB.star,
        multiple: 1
      },
      ...FilterPopupProps<IReview, DataIndex>({
        dataIndex: 'star',
        defaultValue: queryData?.starsRating || [],
        filterCustom: RATING_OPTIONS_FILTERS,
        selectCustom: RATING_SELECT_FILTERS,
        _handleFilter: handleFilter
      })
    },
    {
      title: MANAGE_REVIEW_FIELDS.created_at,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 200,
      render: (createdDate: string): React.ReactNode => {
        return <Text>{formatDate(createdDate)}</Text>
      },
      showSorterTooltip: false,
      sorter: {
        compare: (itemA: IReview, itemB: IReview) => compareDates(itemA.created_at, itemB.created_at)
      }
    },
    {
      title: MANAGE_REVIEW_FIELDS.reportedCount,
      dataIndex: 'reportedCount',
      align: 'center',
      key: 'reportedCount',
      width: 150
    }
  ]

  const options = [
    {
      value: ACTIVE_FETCH,
      label: 'Active reviews'
    },
    {
      value: DELETED_FETCH,
      label: 'Deleted reviews'
    }
  ]

  const onChangePagination: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page)
  }

  const onChangeDatePicker: RangePickerProps['onChange'] = (_dates: unknown, dateStrings: [string, string]) => {
    if (dateStrings[0] === '' || dateStrings[1] === '') {
      setQueryData((prev) => {
        const queryTemp: IGetAllReviewOfAdminQuery = { ...prev }
        delete queryTemp.startDate
        delete queryTemp.endDate
        return { ...queryTemp } as IGetAllReviewOfAdminQuery
      })
    } else {
      setQueryData(
        (prev) => ({ ...prev, startDate: dateStrings[0], endDate: dateStrings[1] }) as IGetAllReviewOfAdminQuery
      )
    }
  }

  const handleDeleteReview = (): void => {
    deleteReviewMutation({
      deleteType: reviewOptionBoolean ? DELETE_OPTIONS.HARD : DELETE_OPTIONS.SOFT,
      reviewId: selectedReview?.id ?? ''
    })
    refDeleteReviewModal.current?.hideModal()
  }

  const handleRestoreReview = (): void => {
    restoreDeletedReviewMutation(selectedReview?.id ?? '')
    refRestoreModal.current?.hideModal()
  }

  return (
    <div className='--manage-review'>
      <Row className='mb-3' style={{ height: 36 }}>
        <Col span={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={20} sm={16} md={14} lg={10} xl={6}>
            <Select
              onChange={onChangeSelection}
              optionFilterProp='children'
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
              className='filter-select w-100'
              value={reviewOption}
              options={options}
            />
          </Col>
        </Col>

        <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>
            Total: <strong>{reviewsData?.totalRecords}</strong>
          </span>
        </Col>

        <Col span={6} className='d-flex justify-content-end'>
          <RangePicker format={DEFAULT_DATE_FORMAT} onChange={onChangeDatePicker} />
        </Col>
      </Row>

      <TableComponent
        isFetching={isLoadingReviews}
        columns={listColumns}
        dataSource={reviewsData?.data ?? []}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: reviewsData?.totalRecords ?? 0,
          onChange: onChangePagination
        }}
        _onChange={onChangeSorter}
        className='--manage-review-table'
      />

      <RestoreModal
        title={MODAL_TEXT.RESTORE_REVIEW_TITLE}
        content={
          <>
            <Text strong>{MODAL_TEXT.RESTORE_REVIEW}</Text>
            <Text>Content: {selectedReview?.content}</Text>
          </>
        }
        handleConfirm={handleRestoreReview}
        ref={refRestoreModal}
      />

      <DeleteModal
        title={MODAL_TEXT.DELETE_REVIEW_TITLE}
        content={
          <>
            <Text strong type={reviewOptionBoolean ? 'danger' : undefined}>
              {reviewOptionBoolean ? MODAL_TEXT.DELETE_REVIEW_PERMANENT : MODAL_TEXT.DELETE_REVIEW_TEMPORARY}
            </Text>
            <Text>Content: {selectedReview?.content}</Text>
          </>
        }
        handleConfirm={handleDeleteReview}
        ref={refDeleteReviewModal}
      />
    </div>
  )
}

export default ManageReview
