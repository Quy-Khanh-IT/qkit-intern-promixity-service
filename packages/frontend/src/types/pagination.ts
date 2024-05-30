export interface IPaginationResponse<T = unknown> {
  currentPage: number
  data: T[]
  links: {
    first: string
    previous: string
    next: string
    last: string
  }
  pageSize: number
  totalPages: number
  totalRecords: number
}
