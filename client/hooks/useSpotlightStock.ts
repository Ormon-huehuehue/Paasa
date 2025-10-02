import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { 
  SpotlightStock, 
  UseSpotlightStockReturn, 
  LoadingState, 
  ErrorState, 
  SpotlightParams 
} from '../types/api';

/**
 * Custom hook for managing spotlight stock data with random selection and error handling
 * @param symbol - Optional specific symbol to fetch, if not provided will randomly select
 * @returns UseSpotlightStockReturn object with data, loading states, error states, and control functions
 */
export const useSpotlightStock = (symbol?: string): UseSpotlightStockReturn => {
  // State management
  const [data, setData] = useState<SpotlightStock | null>(null);
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

  // Refs for preventing duplicate requests and managing state
  const isRequestInProgress = useRef<boolean>(false);
  const currentSymbol = useRef<string | undefined>(symbol);

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
    console.error('Error fetching spotlight stock:', err);
    
    let errorType: ErrorState['errorType'] = 'unknown';
    let errorMessage = 'An unexpected error occurred while fetching stock data';

    if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      errorType = 'network';
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (err.code === 'TIMEOUT_ERROR' || err.message?.includes('timeout')) {
      errorType = 'timeout';
      errorMessage = 'Request timed out. Please try again.';
    } else if (err.response?.status >= 500) {
      errorType = 'server';
      errorMessage = 'Server error. Please try again later.';
    } else if (err.response?.status === 404) {
      errorType = 'validation';
      errorMessage = 'Stock not found. Please try a different symbol.';
      isRetryable = false;
    } else if (err.response?.status >= 400 && err.response?.status < 500) {
      errorType = 'validation';
      errorMessage = err.response?.data?.error?.message || 'Invalid stock symbol';
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
   * Validate spotlight stock data
   */
  const validateSpotlightData = useCallback((stock: SpotlightStock): boolean => {
    return !!(
      stock.symbol &&
      stock.name &&
      typeof stock.price === 'number' &&
      typeof stock.change === 'number' &&
      typeof stock.changePercent === 'number' &&
      stock.description
    );
  }, []);

  /**
   * Fetch spotlight stock data from the API
   */
  const fetchSpotlightData = useCallback(async (
    params: SpotlightParams,
    isRefresh: boolean = false
  ) => {
    if (isRequestInProgress.current) return;
    
    isRequestInProgress.current = true;
    clearError();

    // Set appropriate loading state
    setLoading(prev => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      isLoadingMore: false
    }));

    try {
      const response = await apiService.getSpotlightStock(params);

      if (response.success && response.data) {
        const spotlightStock = response.data;
        
        // Validate the received data
        if (validateSpotlightData(spotlightStock)) {
          setData(spotlightStock);
          setLastUpdated(new Date());
        } else {
          throw new Error('Invalid spotlight stock data received');
        }
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
  }, [clearError, handleError, validateSpotlightData]);

  /**
   * Initial data fetch
   */
  const fetchInitialData = useCallback(() => {
    fetchSpotlightData({
      symbol: currentSymbol.current
    });
  }, [fetchSpotlightData]);

  /**
   * Refetch data (for pull-to-refresh or manual refresh)
   * This will select a new random stock if no specific symbol is provided
   */
  const refetch = useCallback(() => {
    fetchSpotlightData({
      symbol: currentSymbol.current
    }, true);
  }, [fetchSpotlightData]);

  // Update ref when symbol prop changes
  useEffect(() => {
    currentSymbol.current = symbol;
  }, [symbol]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Refetch when symbol changes
  useEffect(() => {
    if (currentSymbol.current !== symbol) {
      currentSymbol.current = symbol;
      fetchInitialData();
    }
  }, [symbol, fetchInitialData]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated
  };
};

export default useSpotlightStock;