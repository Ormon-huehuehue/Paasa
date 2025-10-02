# Design Document

## Overview

This design outlines the refactoring and organization of a Node.js/Express TypeScript backend that serves as a proxy for Yahoo Finance stock data. The system will be restructured following senior backend engineering practices with proper yahoofinance2 integration, comprehensive error handling, and optional Redis caching for performance optimization.

The architecture prioritizes reliability, maintainability, and type safety while ensuring proper integration with the yahoofinance2 package according to its official documentation.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │───▶│  Express API    │───▶│ Yahoo Finance   │
│                 │    │     Server      │    │      API        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Redis Cache    │
                       │   (Optional)    │
                       └─────────────────┘
```

### Layer Architecture

1. **API Layer**: Express routes and controllers handling HTTP requests
2. **Service Layer**: Business logic and Yahoo Finance integration
3. **Cache Layer**: Optional Redis caching for performance
4. **Configuration Layer**: Environment-based configuration management

### Design Decisions

- **Express Framework**: Chosen for its maturity, extensive middleware ecosystem, and TypeScript compatibility
- **yahoofinance2 Package**: Official package with proper documentation and maintained API methods
- **Layered Architecture**: Separation of concerns for maintainability and testability
- **Optional Caching**: Redis implementation as enhancement without breaking core functionality

## Components and Interfaces

### Directory Structure

```
src/
├── controllers/          # HTTP request handlers
│   ├── marketController.ts
│   └── newsController.ts
├── services/            # Business logic and external API integration
│   ├── yahooFinanceService.ts
│   └── cacheService.ts
├── routes/              # Express route definitions
│   ├── index.ts
│   ├── marketRoutes.ts
│   └── newsRoutes.ts
├── middleware/          # Custom middleware
│   ├── errorHandler.ts
│   ├── requestLogger.ts
│   └── validation.ts
├── config/              # Configuration management
│   ├── database.ts
│   ├── environment.ts
│   └── redis.ts
├── types/               # TypeScript type definitions
│   ├── api.ts
│   ├── market.ts
│   └── yahoo.ts
└── utils/               # Utility functions
    ├── logger.ts
    └── responseFormatter.ts
```

### Core Interfaces

#### Market Data Types
```typescript
interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

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
  peRatio: number;
}

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
}
```

#### Service Interfaces
```typescript
interface IYahooFinanceService {
  getMarketIndexes(): Promise<MarketIndex[]>;
  getTopGainers(): Promise<Stock[]>;
  getTopLosers(): Promise<Stock[]>;
  getMostActive(): Promise<Stock[]>;
  getSpotlightStock(): Promise<SpotlightStock>;
  getLatestNews(): Promise<NewsItem[]>;
}

interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  isAvailable(): boolean;
}
```

### API Endpoints

| Endpoint | Method | Description | Cache TTL |
|----------|--------|-------------|-----------|
| `/indexes` | GET | Market indexes (S&P 500, NASDAQ 100) | 60s |
| `/gainers` | GET | Top gaining stocks | 60s |
| `/losers` | GET | Top losing stocks | 60s |
| `/active` | GET | Most actively traded stocks | 60s |
| `/spotlight` | GET | Featured stock with details | 60s |
| `/news` | GET | Latest financial news | 300s |

## Data Models

### Yahoo Finance Integration

The system will use yahoofinance2 package methods according to official documentation:

- **Market Data**: `quoteSummary()` for detailed stock information
- **Market Movers**: `insights()` for gainers, losers, and active stocks
- **News**: `search()` with news filter for financial news
- **Historical Data**: `historical()` for trend analysis (future enhancement)

### Response Format Standardization

All API responses will follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  cached?: boolean;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### Caching Strategy

- **Cache Keys**: Namespaced format `stock-proxy:{endpoint}:{params}`
- **TTL Values**: 60 seconds for market data, 300 seconds for news
- **Fallback**: System continues without caching if Redis unavailable
- **Cache Warming**: Optional background refresh for frequently accessed data

## Error Handling

### Error Categories

1. **External API Errors**: Yahoo Finance API failures, timeouts, rate limits
2. **Validation Errors**: Invalid request parameters, malformed data
3. **System Errors**: Database connection issues, configuration problems
4. **Cache Errors**: Redis connection failures (non-blocking)

### Error Handling Strategy

- **Graceful Degradation**: Cache failures don't break core functionality
- **Retry Logic**: Exponential backoff for transient Yahoo Finance API errors
- **Circuit Breaker**: Prevent cascading failures from external API issues
- **Error Logging**: Structured logging with correlation IDs for debugging
- **Client-Safe Responses**: No sensitive information exposed in error messages

### HTTP Status Codes

- `200`: Successful data retrieval
- `400`: Invalid request parameters
- `429`: Rate limit exceeded
- `500`: Internal server error
- `502`: External API unavailable
- `503`: Service temporarily unavailable

## Testing Strategy

### Unit Testing
- Service layer methods with mocked Yahoo Finance responses
- Utility functions and data transformations
- Error handling scenarios and edge cases
- Cache service operations with Redis mock

### Integration Testing
- End-to-end API endpoint testing
- Yahoo Finance API integration with real responses
- Redis caching behavior verification
- Error propagation through layers

### Performance Testing
- Response time benchmarks for each endpoint
- Cache hit/miss ratio optimization
- Concurrent request handling
- Memory usage monitoring

### Testing Tools
- **Jest**: Primary testing framework
- **Supertest**: HTTP endpoint testing
- **Redis-Mock**: Cache layer testing
- **MSW**: Yahoo Finance API mocking

## Configuration Management

### Environment Variables

```typescript
interface Config {
  // Server Configuration
  PORT: number;
  NODE_ENV: string;
  
  // API Configuration
  YAHOO_API_TIMEOUT: number;
  YAHOO_API_RETRY_ATTEMPTS: number;
  
  // Cache Configuration (Optional)
  REDIS_URL?: string;
  REDIS_PASSWORD?: string;
  CACHE_TTL_MARKET: number;
  CACHE_TTL_NEWS: number;
  
  // Logging
  LOG_LEVEL: string;
}
```

### Default Values
- `PORT`: 3000
- `YAHOO_API_TIMEOUT`: 10000ms
- `YAHOO_API_RETRY_ATTEMPTS`: 3
- `CACHE_TTL_MARKET`: 60 seconds
- `CACHE_TTL_NEWS`: 300 seconds
- `LOG_LEVEL`: 'info'

### Configuration Validation
- Required environment variables validation on startup
- Type checking and format validation
- Graceful fallback to defaults where appropriate
- Clear error messages for missing critical configuration