import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  CACHE_TTL: {
    STOCKS: 30000, // 30 seconds
    NEWS: 300000,  // 5 minutes
  }
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_CACHING: true,
  ENABLE_RETRY: true,
  ENABLE_PULL_TO_REFRESH: true,
  SPOTLIGHT_STOCKS: ['NVDA', 'TSLA', 'AMD', 'AAPL', 'GOOGL']
};

// Error types for better error handling
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;
}

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add timestamp to prevent caching issues
      if (config.params) {
        config.params._t = Date.now();
      } else {
        config.params = { _t: Date.now() };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor with error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const apiError = transformError(error);
      
      // Retry logic for retryable errors
      if (apiError.retryable && FEATURE_FLAGS.ENABLE_RETRY) {
        const config = error.config as any;
        const retryCount = config.__retryCount || 0;
        
        if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
          config.__retryCount = retryCount + 1;
          
          // Exponential backoff
          const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return client(config);
        }
      }
      
      return Promise.reject(apiError);
    }
  );

  return client;
};

// Transform axios errors to our custom error format
const transformError = (error: AxiosError): ApiError => {
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return {
      type: ApiErrorType.TIMEOUT_ERROR,
      message: 'Request timed out. Please check your connection and try again.',
      retryable: true
    };
  }
  
  if (!error.response) {
    return {
      type: ApiErrorType.NETWORK_ERROR,
      message: 'Network error. Please check your internet connection.',
      retryable: true
    };
  }
  
  const statusCode = error.response.status;
  
  if (statusCode >= 500) {
    return {
      type: ApiErrorType.SERVER_ERROR,
      message: 'Server error. Please try again later.',
      statusCode,
      retryable: true
    };
  }
  
  if (statusCode === 429) {
    return {
      type: ApiErrorType.RATE_LIMIT_ERROR,
      message: 'Too many requests. Please wait a moment and try again.',
      statusCode,
      retryable: true
    };
  }
  
  if (statusCode >= 400 && statusCode < 500) {
    const responseData = error.response.data as any;
    return {
      type: ApiErrorType.VALIDATION_ERROR,
      message: responseData?.message || 'Invalid request.',
      statusCode,
      retryable: false
    };
  }
  
  return {
    type: ApiErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred.',
    statusCode,
    retryable: false
  };
};

// Export the configured API client
export const apiClient = createApiClient();

// Utility function to check if error is retryable
export const isRetryableError = (error: ApiError): boolean => {
  return error.retryable;
};

// Utility function to get user-friendly error message
export const getErrorMessage = (error: ApiError): string => {
  return error.message;
};