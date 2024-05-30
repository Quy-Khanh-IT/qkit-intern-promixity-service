import { Pagination, Row, Skeleton, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import './table.scss'

export interface ITableProps<T> {
  isFetching: boolean
  columns: ColumnsType<T>
  dataSource: T[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (_page: number, _pageSize: number) => void
  }
  className: string
}

type DataWithKey<T> = T & { key: string }

const TableComponent = <T,>({
  isFetching,
  columns,
  dataSource,
  pagination,
  className
}: ITableProps<T>): React.ReactNode => {
  const usersWithKeys: DataWithKey<T>[] = dataSource.map((item, index) => ({ ...item, key: index }) as DataWithKey<T>)

  return (
    <>
      <div className='--table-cover'>
        {isFetching ? (
          <Skeleton active paragraph={{ rows: pagination?.pageSize || 20 }} className='--skeleton-custom' />
        ) : (
          <Table
            columns={columns as ColumnsType}
            pagination={false}
            dataSource={usersWithKeys}
            className={`scroll-bar-2 --manage-table ${className}`}
          />
        )}
      </div>

      {pagination ? (
        <Row justify='end' align='bottom' className='row-pagination'>
          <Pagination
            showSizeChanger={false}
            current={pagination?.current}
            defaultCurrent={1}
            pageSize={pagination?.pageSize}
            total={pagination?.total}
            className='table-pagination'
            onChange={(page, pageSize) => {
              pagination?.onChange(page, pageSize)
            }}
          />
        </Row>
      ) : (
        <></>
      )}
    </>
  )
}

export default TableComponent
