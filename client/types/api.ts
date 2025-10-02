// Base API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  pagination?: PaginationInfo;
}

// Pagination Information
export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset?: number;
}

// Stock Data Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

// Extended stock information for spotlight feature
export interface SpotlightStock extends Stock {
  description: string;
  marketCap: number;
  peRatio?: number;
  sector?: string;
  industry?: string;
}

// News Item Structure
export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
  uuid?: string;
}

// Market Index Data
export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// API Response Types for specific endpoints
export interface StockListResponse extends ApiResponse<{
  title: string;
  stocks: Stock[];
  pagination: PaginationInfo;
}> {}

export interface SpotlightStockResponse extends ApiResponse<SpotlightStock> {}

export interface NewsResponse extends ApiResponse<NewsItem[]> {}

export interface MarketIndexResponse extends ApiResponse<MarketIndex[]> {}

// Error Response Structure
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Request Parameters Types
export interface StockListParams {
  limit?: number;
  offset?: number;
}

export interface NewsParams {
  query?: string;
  limit?: number;
  offset?: number;
}

export interface SpotlightParams {
  symbol?: string;
}

// Data transformation utility types
export interface StockDataTransform {
  symbol: string;
  name: string;
  price: string; // Formatted price with currency
  change: string; // Formatted change with +/- prefix
  changePercent: string; // Formatted percentage with +/- prefix and %
  volume: string; // Formatted volume with K/M/B abbreviations
  changeColor: 'positive' | 'negative' | 'neutral'; // Color indicator for UI
}

export interface NewsDataTransform extends Omit<NewsItem, 'publishedAt'> {
  publishedAt: string; // Formatted relative time
  timeAgo: string; // Human readable time ago
}

// Loading and Error State Types
export interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage: string | null;
  errorType: 'network' | 'server' | 'validation' | 'timeout' | 'unknown' | null;
  isRetryable: boolean;
}

// Hook Return Types
export interface UseStockDataReturn {
  data: Stock[] | null;
  loading: LoadingState;
  error: ErrorState;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
  lastUpdated: Date | null;
}

export interface UseNewsDataReturn {
  data: NewsItem[] | null;
  loading: LoadingState;
  error: ErrorState;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
  lastUpdated: Date | null;
}

export interface UseSpotlightStockReturn {
  data: SpotlightStock | null;
  loading: LoadingState;
  error: ErrorState;
  refetch: () => void;
  lastUpdated: Date | null;
}

// Cache Entry Structure
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// API Service Interface
export interface ApiServiceInterface {
  // Stock endpoints
  getTopGainers(params?: StockListParams): Promise<StockListResponse>;
  getTopLosers(params?: StockListParams): Promise<StockListResponse>;
  getMostActive(params?: StockListParams): Promise<StockListResponse>;
  getSpotlightStock(params?: SpotlightParams): Promise<SpotlightStockResponse>;
  
  // News endpoints
  getLatestNews(params?: NewsParams): Promise<NewsResponse>;
  
  // Market endpoints
  getMarketIndexes(): Promise<MarketIndexResponse>;
}

// Component Props Types
export interface StockListTabsProps {
  onStockPress?: (stock: Stock) => void;
}

export interface NewsSectionProps {
  limit?: number;
  showFullList?: boolean;
  onNewsPress?: (newsItem: NewsItem) => void;
}

export interface StockSpotlightProps {
  onStockPress?: (stock: SpotlightStock) => void;
}

// Utility Types for Data Formatting
export type PriceFormatter = (price: number) => string;
export type PercentageFormatter = (percent: number) => string;
export type VolumeFormatter = (volume: number) => string;
export type DateFormatter = (date: Date) => string;

// Constants for formatting
export const FORMATTING_CONSTANTS = {
  CURRENCY_SYMBOL: '$',
  DECIMAL_PLACES: 2,
  VOLUME_ABBREVIATIONS: {
    THOUSAND: 'K',
    MILLION: 'M',
    BILLION: 'B',
    TRILLION: 'T'
  },
  COLOR_SCHEME: {
    POSITIVE: '#00C851',
    NEGATIVE: '#FF4444',
    NEUTRAL: '#666666'
  }
} as const;