export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message: string;
}
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
