/**
 * API response type definitions
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationInfo;
}

export interface PaginatedStockResponse extends ApiResponse<{ title: string; stocks: any[]; pagination: PaginationInfo }> {}

export type ApiResult<T> = ApiResponse<T> | ErrorResponse;