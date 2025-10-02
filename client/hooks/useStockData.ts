import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { 
  Stock, 
  UseStockDataReturn, 
  LoadingState, 
  ErrorState, 
  StockListParams 
} from '../types/api';

// Mock data for fallback when API is not available
const MOCK_STOCKS: Record<string, Stock[]> = {
  gainers: [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 45.32, changePercent: 5.46, volume: 12500000 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 12.75, changePercent: 5.41, volume: 8900000 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 164.23, change: 7.89, changePercent: 5.05, volume: 6700000 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 192.53, change: 8.12, changePercent: 4.40, volume: 15600000 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 2847.91, change: 98.45, changePercent: 3.58, volume: 4200000 },
  ],
  losers: [
    { symbol: 'META', name: 'Meta Platforms Inc', price: 298.75, change: -18.25, changePercent: -5.76, volume: 9800000 },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 421.33, change: -22.67, changePercent: -5.11, volume: 3400000 },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 3127.45, change: -145.55, changePercent: -4.45, volume: 7800000 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.92, change: -16.08, changePercent: -4.07, volume: 11200000 },
    { symbol: 'CRM', name: 'Salesforce Inc', price: 267.89, change: -10.11, changePercent: -3.64, volume: 2900000 },
  ],
  active: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 445.67, change: 2.33, changePercent: 0.53, volume: 45600000 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 378.92, change: -1.08, changePercent: -0.28, volume: 32100000 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 192.53, change: 8.12, changePercent: 4.40, volume: 28900000 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 12.75, changePercent: 5.41, volume: 25700000 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 45.32, changePercent: 5.46, volume: 23400000 },
  ]
};

type StockEndpoint = 'gainers' | 'losers' | 'active';

/**
 * Custom hook for managing stock data with loading states, error handling, and pagination
 * @param endpoint - The stock endpoint to fetch data from ('gainers', 'losers', 'active')
 * @param initialLimit - Initial number of items to fetch (default: 20)
 * @returns UseStockDataReturn object with data, loading states, error states, and control functions
 */
export const useStockData = (
  endpoint: StockEndpoint, 
  initialLimit: number = 5
): UseStockDataReturn => {
  // State management
  const [data, setData] = useState<Stock[] | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false
  });
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    errorMessage: null,
    errorType: null,
    isRetryable: false
  });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for managing pagination and preventing duplicate requests
  const currentOffset = useRef<number>(0);
  const isRequestInProgress = useRef<boolean>(false);
  const limit = useRef<number>(initialLimit);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError({
      hasError: false,
      errorMessage: null,
      errorType: null,
      isRetryable: false
    });
  }, []);

  /**
   * Handle API errors and set appropriate error state
   */
  const handleError = useCallback((err: any, isRetryable: boolean = true) => {
    console.error(`[useStockData] Error fetching ${endpoint} stocks:`, err);
    console.error(`[useStockData] Error details:`, {
      message: err.message,
      code: err.code,
      type: err.type,
      response: err.response?.data,
      status: err.response?.status
    });
    
    let errorType: ErrorState['errorType'] = 'unknown';
    let errorMessage = 'An unexpected error occurred';

    if (err.type === 'NETWORK_ERROR' || err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error') || err.code === 'ECONNREFUSED') {
      errorType = 'network';
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (err.type === 'TIMEOUT_ERROR' || err.code === 'TIMEOUT_ERROR' || err.message?.includes('timeout')) {
      errorType = 'timeout';
      errorMessage = 'Request timed out. Please try again.';
    } else if (err.response?.status >= 500) {
      errorType = 'server';
      errorMessage = 'Server error. Please try again later.';
    } else if (err.response?.status >= 400 && err.response?.status < 500) {
      errorType = 'validation';
      errorMessage = err.response?.data?.error?.message || 'Invalid request';
      isRetryable = false;
    } else if (err.message) {
      errorMessage = err.message;
    }

    setError({
      hasError: true,
      errorMessage,
      errorType,
      isRetryable
    });
  }, [endpoint]);

  /**
   * Fetch stock data from the API
   */
  const fetchStockData = useCallback(async (
    params: StockListParams,
    isLoadMore: boolean = false,
    isRefresh: boolean = false
  ) => {
    if (isRequestInProgress.current) return;
    
    isRequestInProgress.current = true;
    clearError();

    console.log(`[useStockData] Fetching ${endpoint} stocks with params:`, params);

    // Set appropriate loading state
    setLoading(prev => ({
      ...prev,
      isLoading: !isLoadMore && !isRefresh,
      isRefreshing: isRefresh,
      isLoadingMore: isLoadMore
    }));

    try {
      let response;
      
      // Call appropriate API method based on endpoint
      switch (endpoint) {
        case 'gainers':
          console.log('[useStockData] Calling getTopGainers');
          response = await apiService.getTopGainers(params);
          break;
        case 'losers':
          console.log('[useStockData] Calling getTopLosers');
          response = await apiService.getTopLosers(params);
          break;
        case 'active':
          console.log('[useStockData] Calling getMostActive');
          response = await apiService.getMostActive(params);
          break;
        default:
          throw new Error(`Invalid endpoint: ${endpoint}`);
      }

      console.log(`[useStockData] API response for ${endpoint}:`, response);

      if (response.success && response.data) {
        const newStocks = response.data.stocks;
        console.log(`[useStockData] Received ${newStocks?.length || 0} stocks for ${endpoint}`);
        
        if (!newStocks || !Array.isArray(newStocks)) {
          console.error(`[useStockData] Invalid stocks data:`, newStocks);
          throw new Error('Invalid response format: stocks data is not an array');
        }
        
        if (isLoadMore) {
          // Append new data for pagination
          setData(prevData => prevData ? [...prevData, ...newStocks] : newStocks);
        } else {
          // Replace data for initial load or refresh
          setData(newStocks);
        }

        // Update pagination info
        const pagination = response.data.pagination;
        console.log(`[useStockData] Pagination info:`, pagination);
        setHasMore(pagination?.hasMore || false);
        
        if (pagination?.nextOffset !== undefined) {
          currentOffset.current = pagination.nextOffset;
        } else {
          currentOffset.current = (params.offset || 0) + newStocks.length;
        }

        setLastUpdated(new Date());
      } else {
        console.error(`[useStockData] Invalid response structure:`, { success: response.success, data: response.data });
        throw new Error(`Invalid response format: success=${response.success}, hasData=${!!response.data}`);
      }
    } catch (err) {
      console.error(`[useStockData] Error fetching ${endpoint} stocks:`, err);
      
      // Check if it's a network error (likely backend not running)
      if (err.type === 'NETWORK_ERROR' || err.message?.includes('Network Error') || err.code === 'ECONNREFUSED') {
        console.log(`[useStockData] Backend not available, using mock data for ${endpoint}`);
        
        // Use mock data as fallback
        const mockStocks = MOCK_STOCKS[endpoint] || [];
        const offset = params.offset || 0;
        const limit = params.limit || 5;
        const paginatedMockStocks = mockStocks.slice(offset, offset + limit);
        
        if (isLoadMore) {
          setData(prevData => prevData ? [...prevData, ...paginatedMockStocks] : paginatedMockStocks);
        } else {
          setData(paginatedMockStocks);
        }
        
        setHasMore(offset + limit < mockStocks.length);
        currentOffset.current = offset + paginatedMockStocks.length;
        setLastUpdated(new Date());
        
        // Set a warning error state to inform user about mock data
        setError({
          hasError: true,
          errorMessage: 'Using demo data - backend server not available',
          errorType: 'network',
          isRetryable: true
        });
        
        return; // Don't throw the error, we handled it with mock data
      }
      
      handleError(err);
    } finally {
      console.log(`[useStockData] Finished fetching ${endpoint} stocks`);
      setLoading({
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false
      });
      isRequestInProgress.current = false;
    }
  }, [endpoint, clearError, handleError]);

  /**
   * Initial data fetch
   */
  const fetchInitialData = useCallback(() => {
    currentOffset.current = 0;
    setHasMore(true);
    fetchStockData({ 
      limit: limit.current, 
      offset: 0 
    });
  }, [fetchStockData]);

  /**
   * Refetch data (for pull-to-refresh)
   */
  const refetch = useCallback(() => {
    currentOffset.current = 0;
    setHasMore(true);
    fetchStockData({ 
      limit: limit.current, 
      offset: 0 
    }, false, true);
  }, [fetchStockData]);

  /**
   * Load more data (for pagination)
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loading.isLoadingMore && !loading.isLoading) {
      fetchStockData({
        limit: limit.current,
        offset: currentOffset.current
      }, true);
    }
  }, [hasMore, loading.isLoadingMore, loading.isLoading, fetchStockData]);

  // Initial data fetch on mount or endpoint change
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    loading,
    error,
    refetch,
    loadMore,
    hasMore,
    lastUpdated
  };
};

export default useStockData;