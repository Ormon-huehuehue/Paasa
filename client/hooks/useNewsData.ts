import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import {
  NewsItem,
  UseNewsDataReturn,
  LoadingState,
  ErrorState,
  NewsParams
} from '../types/api';

/**
 * Custom hook for managing news data with loading states and error handling
 * @param query - Optional search query for filtering news
 * @param limit - Number of news items to fetch (default: 10)
 * @returns UseNewsDataReturn object with data, loading states, error states, and control functions
 */
export const useNewsData = (
  query?: string,
  limit: number = 5
): UseNewsDataReturn => {
  // State management
  const [data, setData] = useState<NewsItem[] | null>(null);
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentOffset, setCurrentOffset] = useState<number>(0);

  // Refs for preventing duplicate requests
  const isRequestInProgress = useRef<boolean>(false);
  const currentQuery = useRef<string | undefined>(query);
  const currentLimit = useRef<number>(limit);

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
    console.error('Error fetching news:', err);

    let errorType: ErrorState['errorType'] = 'unknown';
    let errorMessage = 'An unexpected error occurred while fetching news';

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
  }, []);

  /**
   * Fetch news data from the API
   */
  const fetchNewsData = useCallback(async (
    params: NewsParams,
    isRefresh: boolean = false,
    isLoadMore: boolean = false
  ) => {
    if (isRequestInProgress.current) return;

    isRequestInProgress.current = true;
    clearError();

    // Set appropriate loading state
    setLoading(prev => ({
      ...prev,
      isLoading: !isRefresh && !isLoadMore,
      isRefreshing: isRefresh,
      isLoadingMore: isLoadMore
    }));

    try {
      const response = await apiService.getLatestNews(params);

      if (response.success && response.data) {
        const newsItems = response.data;

        // Validate and filter news items
        const validNewsItems = newsItems.filter(item =>
          item.title &&
          item.url &&
          item.source
        );

        if (isLoadMore) {
          // Append new items to existing data
          console.log('📰 Loading more news - appending', validNewsItems.length, 'new items');
          setData(prevData => {
            const newData = prevData ? [...prevData, ...validNewsItems] : validNewsItems;
            console.log('📰 Total news items after load more:', newData.length);
            return newData;
          });
        } else {
          // Replace data (initial load or refresh)
          console.log('📰 Initial/refresh load - replacing with', validNewsItems.length, 'items');
          setData(validNewsItems);
          setCurrentOffset(params.offset || 0);
        }

        // Update pagination state
        if (response.pagination) {
          setHasMore(response.pagination.hasMore);
          if (isLoadMore) {
            setCurrentOffset(response.pagination.nextOffset || currentOffset + validNewsItems.length);
          }
        } else {
          // If no pagination info, assume no more data if we got less than requested
          setHasMore(validNewsItems.length >= (params.limit || 10));
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
  }, [clearError, handleError, currentOffset]);

  /**
   * Initial data fetch
   */
  const fetchInitialData = useCallback(() => {
    setCurrentOffset(0);
    setHasMore(true);
    fetchNewsData({
      query: currentQuery.current,
      limit: currentLimit.current,
      offset: 0
    });
  }, [fetchNewsData]);

  /**
   * Refetch data (for pull-to-refresh or manual refresh)
   */
  const refetch = useCallback(() => {
    setCurrentOffset(0);
    setHasMore(true);
    fetchNewsData({
      query: currentQuery.current,
      limit: currentLimit.current,
      offset: 0
    }, true);
  }, [fetchNewsData]);

  /**
   * Load more data (for pagination)
   */
  const loadMore = useCallback(() => {
    if (!hasMore || loading.isLoadingMore || loading.isLoading) return;

    fetchNewsData({
      query: currentQuery.current,
      limit: currentLimit.current,
      offset: currentOffset + currentLimit.current
    }, false, true);
  }, [fetchNewsData, hasMore, loading.isLoadingMore, loading.isLoading, currentOffset]);

  // Update refs when props change
  useEffect(() => {
    currentQuery.current = query;
    currentLimit.current = limit;
  }, [query, limit]);

  // Initial data fetch on mount only
  useEffect(() => {
    fetchInitialData();
  }, []); // Empty dependency array - only run on mount

  // Refetch when query changes
  useEffect(() => {
    if (currentQuery.current !== query) {
      setCurrentOffset(0);
      setHasMore(true);
      fetchNewsData({
        query: query,
        limit: currentLimit.current,
        offset: 0
      });
    }
  }, [query, fetchNewsData]);

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

export default useNewsData;