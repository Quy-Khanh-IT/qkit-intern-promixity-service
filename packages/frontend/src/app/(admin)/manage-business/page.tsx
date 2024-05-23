'use client'
import TableComponent from '@/app/components/admin/Table/Table'
import variables from '@/sass/common/_variables.module.scss'
import { IBusiness } from '@/types/business'
import { ColumnsType } from '@/types/common'
import {
  DeleteOutlined,
  EllipsisOutlined,
  FolderViewOutlined,
  SearchOutlined,
  UndoOutlined,
  SnippetsOutlined
} from '@ant-design/icons'
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
import ViewRowDetailsModal from '@/app/components/admin/ViewRowDetails/ViewRowDetailsModal'
import DecentralizeModal from '@/app/components/admin/DecentralizeModal/DecentralizeModal'
import DeleteModal from '@/app/components/admin/DeleteModal/DeleteModal'
import { IModalMethods } from '@/app/components/admin/modal'

const { Text } = Typography
const { starColor } = variables

export interface IManageUserProps {}

// For search
type DataIndex = keyof IBusiness

const ManageBusiness = () => {
  const [userOption, _setUserOption] = useState('1')
  const [businessOne, setBusinessOne] = useState<IBusiness>()
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const refViewDetailsModal = useRef<IModalMethods | null>(null)
  const refModerateModal = useRef<IModalMethods | null>(null)
  const refDeleteBusinessModal = useRef<IModalMethods | null>(null)

  const handleModal = (selectedOpt: number) => {
    if (selectedOpt === 1) {
      refViewDetailsModal.current?.showModal()
    } else if (selectedOpt === 2) {
      refModerateModal.current?.showModal()
    } else if (selectedOpt === 3) {
      refDeleteBusinessModal.current?.showModal()
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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
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

  const listColumns: ColumnsType<IBusiness> = [
    {
      width: 75,
      align: 'center',
      onCell: (_user: IBusiness) => {
        return {
          onClick: () => {
            setBusinessOne(businessData[0])
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
                  key: 'Moderate',
                  label: <span>Moderate</span>,
                  icon: <SnippetsOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
                  onClick: () => handleModal(2)
                }
              ]
            : [
                {
                  key: 'Restore',
                  label: <span>Restore</span>,
                  icon: <UndoOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
                  onClick: () => handleModal(2)
                }
              ]),
          {
            key: 'Delete',
            label: <span>Delete</span>,
            icon: <DeleteOutlined style={{ fontSize: 15, cursor: 'pointer' }} />,
            onClick: () => handleModal(3)
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
      render: (category: string[]) => {
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
      onFilter: (value, record: IBusiness) => {
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
        multiple: 2 // higher -> higher priority
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
      onFilter: (value, record: IBusiness) => {
        console.log(Math.floor(record.overallRating), value)
        const parseValue: number = parseInt(value as string)
        console.log(Math.floor(record.overallRating), value, parseValue)
        return Math.floor(record.overallRating) == parseValue
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: 150,
      render: (status: string) => {
        const color = status == 'Accepted' ? 'green' : 'geekblue'
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
      onFilter: (value, record: IBusiness) => {
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

  const businessWithKeys = businessData.map((item, index) => ({ ...item, key: index }))

  const handleModerate = () => {
    console.log('Moderate')
  }

  const handleDeleteBusiness = () => {
    console.log('Delete')
  }

  return (
    <div className='--manage-business'>
      <Row className='pb-3'>
        <Col span={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={21} sm={16} md={14} lg={10} xl={6}>
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
        selectionOptions={[]}
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
        title='Delete business'
        content={
          <>
            {userOption == '2' ? 'Bạn chắc chắn muốn khôi phục tài khoản' : 'Bạn chắc chắn muốn xoá tài khoản'}
            <strong>{' ' + 'ndtuan21@gmail.com'}</strong>?
          </>
        }
        handleConfirm={handleDeleteBusiness}
        ref={refDeleteBusinessModal}
      />
    </div>
  )
}

export default ManageBusiness
