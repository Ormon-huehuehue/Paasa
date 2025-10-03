import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { MarketIndex, LoadingState, ErrorState } from '../types/api';

export interface UseMarketIndexesReturn {
  data: MarketIndex[] | null;
  loading: LoadingState;
  error: ErrorState;
  refetch: () => void;
  lastUpdated: Date | null;
}

/**
 * Custom hook for fetching and managing market indexes data
 * Provides loading states, error handling, and refetch functionality
 */
export const useMarketIndexes = (): UseMarketIndexesReturn => {
  const [data, setData] = useState<MarketIndex[] | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
  });
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    errorMessage: null,
    errorType: null,
    isRetryable: false,
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError({
      hasError: false,
      errorMessage: null,
      errorType: null,
      isRetryable: false,
    });
  }, []);

  /**
   * Set error state based on the error type
   */
  const setErrorState = useCallback((err: any) => {
    console.error('[useMarketIndexes] Error fetching market indexes:', err);
    
    let errorType: ErrorState['errorType'] = 'unknown';
    let errorMessage = 'Failed to load market indexes';
    let isRetryable = true;

    if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      errorType = 'network';
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (err.code === 'TIMEOUT_ERROR' || err.message?.includes('timeout')) {
      errorType = 'timeout';
      errorMessage = 'Request timed out. Please try again.';
    } else if (err.response?.status >= 400 && err.response?.status < 500) {
      errorType = 'validation';
      errorMessage = 'Invalid request. Please try again.';
      isRetryable = false;
    } else if (err.response?.status >= 500) {
      errorType = 'server';
      errorMessage = 'Server error. Please try again later.';
    }

    setError({
      hasError: true,
      errorMessage,
      errorType,
      isRetryable,
    });
  }, []);

  /**
   * Fetch market indexes data from API
   */
  const fetchMarketIndexes = useCallback(async (isRefresh = false) => {
    try {
      resetError();
      
      setLoading(prev => ({
        ...prev,
        isLoading: !isRefresh && !prev.isRefreshing,
        isRefreshing: isRefresh,
      }));

      const response = await apiService.getMarketIndexes();
      
      if (response.success && response.data) {
        setData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setErrorState(err);
      // Don't clear existing data on error, allow graceful degradation
    } finally {
      setLoading({
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
      });
    }
  }, [resetError, setErrorState]);

  /**
   * Refetch market indexes data
   */
  const refetch = useCallback(() => {
    fetchMarketIndexes(true);
  }, [fetchMarketIndexes]);

  /**
   * Initial data fetch on mount
   */
  useEffect(() => {
    fetchMarketIndexes();
  }, [fetchMarketIndexes]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
};

export default useMarketIndexes;