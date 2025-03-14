export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message: string;
}
