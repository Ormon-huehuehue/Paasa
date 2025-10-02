/**
 * Application constants and enums
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  MARKET_INDEXES: 'market:indexes',
  TOP_GAINERS: 'market:gainers',
  TOP_LOSERS: 'market:losers',
  MOST_ACTIVE: 'market:active',
  SPOTLIGHT_STOCK: 'market:spotlight',
  LATEST_NEWS: 'news:latest',
} as const;

// Default Values
export const DEFAULTS = {
  PORT: 3000,
  YAHOO_API_TIMEOUT: 10000,
  YAHOO_API_RETRY_ATTEMPTS: 3,
  CACHE_TTL_MARKET: 60,
  CACHE_TTL_NEWS: 300,
  LOG_LEVEL: 'info',
  SPOTLIGHT_SYMBOL: 'AAPL',
  NEWS_QUERY: 'US stocks',
  NEWS_LIMIT: 5,
} as const;

// Market Index Symbols
export const MARKET_INDEXES = [
  '^GSPC', // S&P 500
  '^IXIC', // NASDAQ Composite
  '^DJI',  // Dow Jones Industrial Average
  '^RUT',  // Russell 2000
] as const;

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS];