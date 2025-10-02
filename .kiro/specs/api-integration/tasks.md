# Implementation Plan

- [x] 1. Set up API service infrastructure and configuration
  - Create API configuration file with base URL and timeout settings
  - Set up centralized HTTP client with error handling and retry logic
  - Create type definitions for API responses and data models
  - _Requirements: 5.1, 5.2, 6.1, 6.2_

- [x] 1.1 Create API configuration and axios HTTP client
  - Write `client/config/api.ts` with environment-based configuration
  - Set up axios instance with timeout, retry logic, and error handling interceptors
  - _Requirements: 5.1, 5.2_

- [x] 1.2 Define TypeScript interfaces for API responses
  - Create `client/types/api.ts` with Stock, NewsItem, and response interfaces
  - Define error types and pagination interfaces
  - _Requirements: 6.1, 6.2_

- [x] 2. Implement core API service layer
  - Create centralized API service with methods for all endpoints
  - Implement data transformation functions from backend format to client format
  - Add proper error handling and response validation
  - _Requirements: 1.2, 2.2, 4.2, 5.1_

- [x] 2.1 Create API service class with stock endpoints
  - Implement `getTopGainers`, `getTopLosers`, `getMostActive` methods
  - Add data transformation for stock list responses
  - _Requirements: 1.2, 6.1, 6.2_

- [x] 2.2 Add spotlight and news API methods
  - Implement `getSpotlightStock` with random symbol selection
  - Implement `getLatestNews` method with query support
  - _Requirements: 2.2, 4.2_

- [x] 3. Create custom React hooks for data management
  - Implement hooks for stock data, news data, and spotlight stock
  - Add loading states, error handling, and refetch functionality
  - Include pagination support for stock lists
  - _Requirements: 1.3, 1.4, 1.5, 2.3, 2.4, 2.5, 4.3, 4.4, 4.5_

- [x] 3.1 Implement useStockData hook
  - Create hook with loading, error, and data states
  - Add pagination support with loadMore functionality
  - Implement refetch and pull-to-refresh capabilities
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 3.2 Implement useNewsData hook
  - Create hook for fetching news with query and limit parameters
  - Add loading and error state management
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 3.3 Implement useSpotlightStock hook
  - Create hook with random stock selection from predefined list
  - Add loading and error handling for spotlight data
  - _Requirements: 4.1, 4.3, 4.4, 4.5_

- [x] 4. Update StockListTabs component with API integration
  - Replace dummy data with API calls using custom hooks
  - Implement loading indicators and error states for each tab
  - Add pull-to-refresh functionality and pagination
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2_

- [x] 4.1 Integrate API data in StockListTabs
  - Replace dummy data imports with useStockData hook calls
  - Update component to handle loading and error states
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 4.2 Add loading and error UI components
  - Create loading indicators for each stock list tab
  - Implement error messages with retry functionality
  - _Requirements: 1.4, 1.5_

- [x] 4.3 Implement pull-to-refresh and pagination
  - Add RefreshControl to ScrollView components
  - Update "View More" button to use loadMore from hook
  - _Requirements: 5.2, 1.5_

- [x] 5. Update NewsSection component with API integration
  - Replace dummy news data with API calls
  - Implement different display modes for full list vs top 5 items
  - Add tap-to-open functionality for news articles
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

- [x] 5.1 Integrate news API in NewsSection component
  - Replace dummy data with useNewsData hook
  - Handle different display modes (full vs limited)
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 5.2 Add news interaction and error handling
  - Implement tap-to-open functionality using Linking API
  - Add loading states and error handling for news
  - _Requirements: 2.3, 2.4, 2.5, 3.3_

- [x] 6. Update StockSpotlight component with API integration
  - Replace dummy spotlight data with API calls
  - Implement random stock selection and detailed data display
  - Handle optional fields and API failures gracefully
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4_

- [x] 6.1 Integrate spotlight API in StockSpotlight component
  - Replace dummy data with useSpotlightStock hook
  - Implement random stock selection from predefined array
  - _Requirements: 4.1, 4.2_

- [x] 6.2 Handle spotlight data display and formatting
  - Update component to display API data with proper formatting
  - Handle optional fields (peRatio, sector, industry) gracefully
  - _Requirements: 4.3, 6.1, 6.2, 6.3, 6.4_

- [x] 6.3 Add spotlight loading and error states
  - Implement loading indicator for spotlight component
  - Add fallback display for API failures
  - _Requirements: 4.4, 4.5_

- [x] 7. Integrate news display on explore page
  - Update explore page to show top 5 news items
  - Ensure news section integrates smoothly with existing components
  - Handle loading and error states without breaking page layout
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7.1 Update explore page NewsSection integration
  - Modify NewsSection to accept limit prop for top 5 display
  - Ensure proper integration with existing explore page layout
  - _Requirements: 3.1, 3.2_

- [x] 7.2 Handle explore page news error states
  - Implement graceful error handling that doesn't break explore page
  - Add subtle loading states for news section
  - _Requirements: 3.4, 3.5_

- [x] 8. Add comprehensive error handling and user feedback
  - Implement user-friendly error messages across all components
  - Add retry functionality for failed API calls
  - Ensure graceful degradation when APIs are unavailable
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8.1 Create error handling utilities and components
  - Create reusable error message components
  - Implement retry logic with exponential backoff
  - _Requirements: 5.1, 5.2_

- [x] 8.2 Add comprehensive error states to all components
  - Update all components with consistent error handling
  - Implement fallback data display when available
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 9. Integrate market indexes API in MarketSnapshot component
  - Replace dummy trending stocks data with market indexes API
  - Create useMarketIndexes hook for data management
  - Update MarketSnapshot component to display market indexes with proper formatting
  - Add loading and error states for market indexes
  - _Requirements: 6.1, 6.2, 5.1, 5.2_

- [x] 9.1 Create useMarketIndexes hook
  - Implement hook for fetching market indexes data
  - Add loading, error, and refetch functionality
  - _Requirements: 5.1, 5.2_

- [x] 9.2 Update MarketSnapshot component with API integration
  - Replace trendingStocks dummy data with useMarketIndexes hook
  - Update component to display market indexes (S&P 500, NASDAQ, etc.)
  - Add loading indicators and error handling
  - _Requirements: 6.1, 6.2_

- [x] 10. Clean up remaining dummy data usage
  - Remove unused dummy data imports and constants
  - Ensure all components use API data instead of static data
  - Update any remaining hardcoded data references
  - _Requirements: 1.1, 2.1, 4.1_

- [x] 10.1 Update WatchlistSection component
  - Replace watchlist dummy data with user-specific data or remove if not needed
  - Add proper data management for watchlist functionality
  - _Requirements: 1.1_

- [x] 10.2 Clean up unused dummy data constants
  - Remove unused imports from DummyData constants
  - Clean up any remaining static data references
  - _Requirements: All requirements_

- [x] 10.3 Add expand/collapse functionality to StockSpotlight description
  - Truncate description to 50 characters by default
  - Add tap-to-expand functionality for full description
  - Implement smooth reveal animation when expanding/collapsing
  - Add visual indicator (e.g., "Show more"/"Show less" text)
  - _Requirements: 4.3, 6.1, 6.2_

- [ ]* 11. Add unit tests for API integration
  - Write tests for API service methods with mocked responses
  - Test custom hooks with various data states
  - Test error handling scenarios and data transformations
  - _Requirements: All requirements_

- [ ]* 11.1 Write API service tests
  - Test all API service methods with success and error scenarios
  - Mock HTTP responses and test data transformation
  - _Requirements: 1.2, 2.2, 4.2_

- [ ]* 11.2 Write custom hook tests
  - Test useStockData, useNewsData, and useSpotlightStock hooks
  - Test loading states, error handling, and data updates
  - _Requirements: 1.3, 1.4, 1.5, 2.3, 2.4, 2.5, 4.3, 4.4, 4.5_

- [ ]* 11.3 Write component integration tests
  - Test updated components with API integration
  - Test loading states, error states, and user interactions
  - _Requirements: All requirements_