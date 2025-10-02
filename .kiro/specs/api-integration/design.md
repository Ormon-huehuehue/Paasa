# Design Document

## Overview

This design document outlines the integration of the backend Stock Data Proxy API with the React Native client application. The integration will replace static dummy data with real-time market data from the backend API endpoints, implementing proper error handling, loading states, and data transformation.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   API Service   │    │   Backend API   │
│   Components    │◄──►│    Layer        │◄──►│   (Express.js)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Component Mount/User Action** → Triggers API call
2. **API Service Layer** → Handles HTTP requests, error handling, and data transformation
3. **Backend API** → Returns structured JSON responses
4. **Component State Update** → Updates UI with new data or error states

## Components and Interfaces

### 1. API Service Layer

**File:** `client/services/apiService.ts`

```typescript
interface ApiService {
  // Stock endpoints
  getTopGainers(limit?: number, offset?: number): Promise<StockListResponse>
  getTopLosers(limit?: number, offset?: number): Promise<StockListResponse>
  getMostActive(limit?: number, offset?: number): Promise<StockListResponse>
  getSpotlightStock(symbol?: string): Promise<SpotlightStockResponse>
  
  // News endpoints
  getLatestNews(query?: string, limit?: number, offset?: number): Promise<NewsResponse>
  
  // Market endpoints
  getMarketIndexes(): Promise<MarketIndexResponse>
}
```

**Key Features:**
- Centralized HTTP client configuration
- Request/response interceptors for error handling
- Automatic retry logic for failed requests
- Request timeout configuration
- Base URL configuration from environment

### 2. Type Definitions

**File:** `client/types/api.ts`

```typescript
// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  pagination?: PaginationInfo;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset?: number;
}

// Stock Types
interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface SpotlightStock extends Stock {
  description: string;
  marketCap: number;
  peRatio?: number;
  sector?: string;
  industry?: string;
}

// News Types
interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
  uuid?: string;
}

// Response Types
interface StockListResponse extends ApiResponse<{
  title: string;
  stocks: Stock[];
  pagination: PaginationInfo;
}> {}

interface SpotlightStockResponse extends ApiResponse<SpotlightStock> {}
interface NewsResponse extends ApiResponse<NewsItem[]> {}
```

### 3. Custom Hooks

**File:** `client/hooks/useStockData.ts`

```typescript
interface UseStockDataReturn {
  data: Stock[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

const useStockData = (endpoint: 'gainers' | 'losers' | 'active'): UseStockDataReturn
```

**File:** `client/hooks/useNewsData.ts`

```typescript
interface UseNewsDataReturn {
  data: NewsItem[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useNewsData = (query?: string, limit?: number): UseNewsDataReturn
```

**File:** `client/hooks/useSpotlightStock.ts`

```typescript
interface UseSpotlightStockReturn {
  data: SpotlightStock | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useSpotlightStock = (): UseSpotlightStockReturn
```

### 4. Updated Components

#### StockListTabs Component
- Replace dummy data with API calls
- Implement loading states for each tab
- Add error handling and retry functionality
- Implement pull-to-refresh
- Add pagination support with "Load More" functionality

#### NewsSection Component
- Fetch news data from API
- Handle different display modes (full list vs top 5)
- Implement tap-to-open functionality
- Add loading and error states

#### StockSpotlight Component
- Random stock selection from predefined list
- Fetch detailed stock information
- Handle missing optional fields (peRatio, sector, industry)
- Implement fallback for API failures

## Data Models

### Stock Data Transformation

```typescript
// Backend API Response → Client Model
const transformStockData = (apiStock: any): Stock => ({
  symbol: apiStock.symbol,
  name: apiStock.name,
  price: apiStock.price,
  change: apiStock.change,
  changePercent: apiStock.changePercent,
  volume: apiStock.volume
});
```

### News Data Transformation

```typescript
// Backend API Response → Client Model
const transformNewsData = (apiNews: any): NewsItem => ({
  title: apiNews.title,
  summary: apiNews.summary,
  url: apiNews.url,
  publishedAt: new Date(apiNews.publishedAt),
  source: apiNews.source,
  uuid: apiNews.uuid
});
```

## Error Handling

### Error Types

```typescript
enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'
}

interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;
}
```

### Error Handling Strategy

1. **Network Errors**: Show retry button with exponential backoff
2. **Server Errors (5xx)**: Automatic retry up to 3 times
3. **Client Errors (4xx)**: Show user-friendly error message
4. **Rate Limiting**: Show temporary message with retry timer
5. **Timeout Errors**: Automatic retry with increased timeout

### Fallback Strategies

1. **Cached Data**: Display last successful response if available
2. **Partial Failures**: Show available data with error indicators for failed sections
3. **Graceful Degradation**: Hide failed components rather than breaking entire screen

## Testing Strategy

### Unit Tests
- API service functions with mocked HTTP responses
- Data transformation functions
- Custom hooks with various data states
- Error handling scenarios

### Integration Tests
- Component rendering with real API responses
- Loading state transitions
- Error state handling
- Pull-to-refresh functionality

### End-to-End Tests
- Complete user flows across all tabs
- Network failure scenarios
- Performance under various network conditions

## Performance Considerations

### Caching Strategy
- Implement in-memory caching for frequently accessed data
- Cache duration: 30 seconds for stock data, 5 minutes for news
- Automatic cache invalidation on pull-to-refresh

### Optimization Techniques
- Debounced API calls for rapid user interactions
- Lazy loading for news articles
- Image optimization for stock logos
- Pagination to reduce initial load time

### Memory Management
- Proper cleanup of API subscriptions in useEffect
- Limit cached data size to prevent memory leaks
- Efficient re-rendering with React.memo where appropriate

## Security Considerations

### API Security
- HTTPS-only communication
- Request timeout to prevent hanging requests
- Input validation for user-provided parameters
- Rate limiting awareness and handling

### Data Privacy
- No sensitive user data transmitted
- Secure handling of external URLs for news articles
- Proper error logging without exposing sensitive information

## Configuration

### Environment Variables

```typescript
// client/config/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: {
    STOCKS: 30000, // 30 seconds
    NEWS: 300000,  // 5 minutes
  }
};
```

### Feature Flags

```typescript
export const FEATURE_FLAGS = {
  ENABLE_CACHING: true,
  ENABLE_RETRY: true,
  ENABLE_PULL_TO_REFRESH: true,
  SPOTLIGHT_STOCKS: ['NVDA', 'TSLA', 'AMD', 'AAPL', 'GOOGL']
};
```

## Implementation Phases

### Phase 1: Core API Integration
- Set up API service layer
- Implement basic data fetching for stocks
- Replace dummy data in StockListTabs

### Phase 2: News Integration
- Implement news API integration
- Update NewsSection component
- Add news to explore page

### Phase 3: Enhanced Features
- Add spotlight stock functionality
- Implement error handling and loading states
- Add pull-to-refresh functionality

### Phase 4: Optimization
- Implement caching strategy
- Add performance monitoring
- Optimize re-rendering and memory usage