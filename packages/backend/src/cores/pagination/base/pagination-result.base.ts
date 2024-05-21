export type PaginationLinks = {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
};

export class PaginationResult<T> {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  data: T[];
  links: PaginationLinks;
}
