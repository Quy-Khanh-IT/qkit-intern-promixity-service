'use client'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import DeleteModal from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'
import TableComponent from '@/app/components/admin/Table/Table'
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import { MODAL_TEXT } from '@/constants'
import variables from '@/sass/common/_variables.module.scss'
import { IBusiness } from '@/types/business'
import { ColumnsType, SelectionOptions } from '@/types/common'
import { EllipsisOutlined, FolderViewOutlined, SearchOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DescriptionsProps,
  Dropdown,
  Flex,
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
import businessData from './business-data.json'
import './manage-business.scss'

const { Text } = Typography
const { starColor } = variables

export interface IManageUserProps {}

// For search
type DataIndex = keyof IBusiness

const ManageBusiness = (): React.ReactNode => {
  const [businessOption, setBusinessOption] = useState<string>('1')
  const [businessOne, setBusinessOne] = useState<IBusiness>()
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')
  const searchInput = useRef<InputRef>(null)

  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refModerateModal = useRef<IModalMethods | null>(null)
  const refDeleteBusinessModal = useRef<IModalMethods | null>(null)
  const [deleteModalTitle, setDeleteModalTitle] = useState<string>(MODAL_TEXT.DELETE_BUSINESS_TITLE)
  const [deleteModalContent, setDeleteModalContent] = useState(MODAL_TEXT.DELETE_BUSINESS_TEMPORARY)
  const [decentralizeOpts, _setDecentralizeOpts] = useState<SelectionOptions[]>([
    { label: 'ACCEPTED', value: 'ACCEPTED' },
    { label: 'PENDING', value: 'PENDING' },
    { label: 'REJECTED', value: 'REJECTED' }
  ])

  const handleModal = (selectedOpt: number): void => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === 2) {
      if (businessOption === '2') {
        refDeleteBusinessModal.current?.showModal()
      } else {
        refModerateModal.current?.showModal()
      }
    } else if (selectedOpt === 3) {
      refDeleteBusinessModal.current?.showModal()
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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<IBusiness> => ({
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
    // onFilter: (value, record: IBusiness) =>
    //   record[dataIndex as keyof IBusiness]
    //     .toString()
    //     .toLowerCase()
    //     .includes((value as string).toLowerCase()),
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

  const listColumns: ColumnsType<IBusiness> = [
    {
      width: 75,
      align: 'center',
      onCell: (business: IBusiness): React.HTMLAttributes<HTMLElement> => {
        return {
          onClick: (): void => {
            setBusinessOne(business)
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
          ...(!(businessOption === '2')
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
                  onClick: (): void => {
                    setDeleteModalTitle(MODAL_TEXT.RESTORE_BUSINESS_TITLE)
                    setDeleteModalContent(MODAL_TEXT.RESTORE_BUSINESS)
                    handleModal(2)
                  }
                }
              ]),
          {
            key: 'Delete ',
            label: <span className={businessOption === '2' ? 'error-modal-title' : ''}>Delete</span>,
            icon: (
              <i
                className={`fa-regular fa-trash ${businessOption === '2' ? 'error-modal-title' : 'delete-icon'}`}
                style={{ fontSize: 15, cursor: 'pointer' }}
              ></i>
            ),
            onClick: (): void => {
              setDeleteModalTitle(MODAL_TEXT.DELETE_BUSINESS_TITLE)
              if (businessOption === '2') {
                setDeleteModalContent(MODAL_TEXT.DELETE_BUSINESS_PERMANENT)
              } else {
                setDeleteModalContent(MODAL_TEXT.DELETE_BUSINESS_TEMPORARY)
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (category: string[]): React.ReactNode => {
        return category.join(', ')
      },
      filters: [
        {
          text: 'Cafe',
          value: 'Cafe'
        },
        {
          text: 'Restaurant',
          value: 'Restaurant'
        },
        {
          text: 'Hotel',
          value: 'Hotel'
        }
      ],
      filterMode: 'tree',
      onFilter: (value, record: IBusiness): boolean => {
        return record.category.includes(value as string)
      }
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address')
    },
    {
      title: 'Total Reviews',
      dataIndex: 'totalReviews',
      align: 'center',
      key: 'totalReviews',
      width: 30,
      showSorterTooltip: false,
      sorter: {
        compare: (a, b) => a.totalReviews - b.totalReviews,
        multiple: 2 // higher priority
      }
    },
    {
      title: 'Average Rating',
      dataIndex: 'overallRating',
      align: 'center',
      key: 'overallRating',
      width: 30,
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
      filters: [
        {
          text: '5 ⭐️',
          value: '5'
        },
        {
          text: '4 ⭐️',
          value: '4'
        },
        {
          text: '3 ⭐️',
          value: '3'
        },
        {
          text: '2 ⭐️',
          value: '2'
        },
        {
          text: '1 ⭐️',
          value: '1'
        }
      ],
      filterMode: 'tree',
      onFilter: (value, record: IBusiness): boolean => {
        const parseValue: number = parseInt(value as string)
        return Math.floor(record.overallRating) === parseValue
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: 150,
      render: (status: string): React.ReactNode => {
        const color = status === 'Accepted' ? 'green' : 'geekblue'
        return (
          <Tag color={color} key={status} className='me-0'>
            {status.toUpperCase()}
          </Tag>
        )
      },
      filters: [
        {
          text: 'Pending',
          value: 'Pending'
        },
        {
          text: 'Accepted',
          value: 'Accepted'
        },
        {
          text: 'Rejected',
          value: 'Rejected'
        }
      ],
      filterMode: 'tree',
      onFilter: (value, record: IBusiness): boolean => {
        return record.status.toLowerCase().includes((value as string).toLowerCase())
      }
    }
  ]

  const detailedItems: DescriptionsProps['items'] = [
    {
      label: 'Name',
      span: 2,
      children: businessOne?.name
    },
    {
      label: 'Category',
      span: 2,
      children: businessOne?.category.join(', ')
    },
    {
      label: 'Address',
      span: 4,
      children: businessOne?.address
    },
    {
      label: 'Total Reviews',
      span: 2,
      children: businessOne?.totalReviews
    },
    {
      label: 'Average Rating',
      span: 2,
      children: businessOne?.overallRating + ' ⭐️'
    },
    {
      label: 'Role',
      span: 4,
      children: (
        <>
          {[businessOne?.status].map((role, index) => {
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
      label: 'Active businesses'
    },
    {
      value: '2',
      label: 'Deleted businesses'
    }
  ]

  const onChangeSelection = (value: string): void => {
    setBusinessOption(value)
  }

  const businessWithKeys = businessData.map((item, index) => ({ ...item, key: index }))

  const handleModerate = (): void => {}

  const handleDeleteBusiness = (): void => {}

  return (
    <div className='--manage-business'>
      <Row className='pb-3'>
        <Col span={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={21} sm={16} md={14} lg={10} xl={6}>
            <Select
              onChange={onChangeSelection}
              // style={{ marginTop: 16 }}
              optionFilterProp='children'
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
              className='filter-select w-100'
              value={businessOption}
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
      <TableComponent
        isFetching={false}
        columns={listColumns}
        dataSource={businessWithKeys}
        className='manage-business-table'
      />

      <ViewRowDetailsModal title='Business details' data={detailedItems} ref={refViewDetailsModal} />
      <DecentralizeModal
        selectionOptions={decentralizeOpts}
        presentOption=''
        ref={refModerateModal}
        title={'Moderate business'}
        specificInfo={
          <>
            <Text>{businessOne?.name}</Text>
          </>
        }
        handleConfirm={handleModerate}
      >
        <Text>Business name:</Text>
        <Text>Status:</Text>
      </DecentralizeModal>
      <DeleteModal
        title={deleteModalTitle}
        content={
          <>
            <span
              className={
                businessOption === '2' && deleteModalContent === MODAL_TEXT.DELETE_BUSINESS_PERMANENT
                  ? 'error-modal-title'
                  : ''
              }
            >
              {deleteModalContent}
            </span>
            {'('}
            <strong>{businessOne?.name}</strong> {')'}
          </>
        }
        handleConfirm={handleDeleteBusiness}
        ref={refDeleteBusinessModal}
      />
    </div>
  )
}

export default ManageBusiness
