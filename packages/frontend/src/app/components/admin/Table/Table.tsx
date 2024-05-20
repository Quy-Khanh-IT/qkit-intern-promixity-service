import { Pagination, Row, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import './table.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = any
export interface ITableProps<T> {
  isFetching: boolean
  columns: ColumnsType<T>
  dataSource: T[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (_page: number, _pageSize?: number) => void
  }
  className: string
}

const TableComponent: React.FC<ITableProps<T>> = ({
  // isFetching,
  columns,
  dataSource,
  // pagination,
  className
}) => {
  return (
    <>
      <Table
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        // style={{ maxHeight: 'calc(100vh - 80px - 48px - 40px - 50px - 50px)' }}
        className={`scroll-bar-2 --manage-table ${className}`}
      />
      <Row justify='end' align='bottom' className='row-pagination'>
        <Pagination
          showSizeChanger={false}
          // current={2}
          defaultCurrent={1}
          pageSize={10}
          total={500}
          className='table-pagination'
          // onChange={(page, pageSize) => {
          //   pagination?.onChange(page, pageSize)
          // }}
        />
      </Row>
    </>
  )
}

export default TableComponent
