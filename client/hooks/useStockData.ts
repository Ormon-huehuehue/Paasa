import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { 
  Stock, 
  UseStockDataReturn, 
  LoadingState, 
  ErrorState, 
  StockListParams 
} from '../types/api';

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
    console.error(`Error fetching ${endpoint} stocks:`, err);
    
    let errorType: ErrorState['errorType'] = 'unknown';
    let errorMessage = 'An unexpected error occurred';

    if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      errorType = 'network';
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (err.code === 'TIMEOUT_ERROR' || err.message?.includes('timeout')) {
      errorType = 'timeout';
      errorMessage = 'Request timed out. Please try again.';
    } else if (err.response?.status >= 500) {
      errorType = 'server';
      errorMessage = 'Server error. Please try again later.';
    } else if (err.response?.status >= 400 && err.response?.status < 500) {
      errorType = 'validation';
      errorMessage = err.response?.data?.error?.message || 'Invalid request';
      isRetryable = false;
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
          response = await apiService.getTopGainers(params);
          break;
        case 'losers':
          response = await apiService.getTopLosers(params);
          break;
        case 'active':
          response = await apiService.getMostActive(params);
          break;
        default:
          throw new Error(`Invalid endpoint: ${endpoint}`);
      }

      if (response.success && response.data) {
        const newStocks = response.data.stocks;
        
        if (isLoadMore) {
          // Append new data for pagination
          setData(prevData => prevData ? [...prevData, ...newStocks] : newStocks);
        } else {
          // Replace data for initial load or refresh
          setData(newStocks);
        }

        // Update pagination info
        const pagination = response.data.pagination;
        setHasMore(pagination?.hasMore || false);
        
        if (pagination?.nextOffset !== undefined) {
          currentOffset.current = pagination.nextOffset;
        } else {
          currentOffset.current = (params.offset || 0) + newStocks.length;
        }

        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      handleError(err);
    } finally {
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