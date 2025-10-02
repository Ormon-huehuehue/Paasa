# Stock Data Proxy API Documentation

## Overview

The Stock Data Proxy API provides access to real-time stock market data, financial news, and market analytics through a RESTful interface. All endpoints support pagination and return data in a consistent JSON format.

## Base URL

```
http://localhost:3001
```

## Authentication

Currently, no authentication is required. Rate limiting is applied per IP address.

## Request/Response Format

### Content Type
All requests and responses use `application/json` content type.

### Standard Response Structure

```typescript
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

## Pagination

All list endpoints support pagination through query parameters:

- `limit`: Number of items to return (1-50, default: 10)
- `offset`: Number of items to skip (≥0, default: 0)

### Pagination Response

```json
{
  "pagination": {
    "total": 25,        // Total items available
    "limit": 5,        // Items per page
    "offset": 0,        // Current offset
    "hasMore": true,    // Whether more items exist
    "nextOffset": 5    // Offset for next page (if hasMore is true)
  }
}
```

## Endpoints Reference

### Market Indexes

```http
GET /indexes
```

**Description:** Get major market indexes (S&P 500, NASDAQ 100, Dow Jones, Russell 2000).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "^GSPC",
      "name": "S&P 500",
      "price": 4327.78,
      "change": 12.45,
      "changePercent": 0.29
    },
    {
      "symbol": "^IXIC",
      "name": "NASDAQ Composite",
      "price": 13245.67,
      "change": -23.12,
      "changePercent": -0.17
    }
  ],
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

**Data Model:**
```typescript
interface MarketIndex {
  symbol: string;        // Index symbol (e.g., "^GSPC")
  name: string;          // Display name
  price: number;         // Current price
  change: number;        // Price change from previous close
  changePercent: number; // Percentage change from previous close
}
```

---

### Top Gaining Stocks

```http
GET /gainers?limit={limit}&offset={offset}
```

**Description:** Get stocks with the highest percentage gains.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 10 | Items per page (1-50) |
| `offset` | number | No | 0 | Items to skip (≥0) |

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Top Gainers",
    "pagination": {
      "total": 12,
      "limit": 5,
      "offset": 0,
      "hasMore": true,
      "nextOffset": 5
    },
    "stocks": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "price": 175.43,
        "change": 4.32,
        "changePercent": 2.53,
        "volume": 45678900
      }
    ]
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

### Top Losing Stocks

```http
GET /losers?limit={limit}&offset={offset}
```

**Description:** Get stocks with the highest percentage losses.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 10 | Items per page (1-50) |
| `offset` | number | No | 0 | Items to skip (≥0) |

**Response:** Same structure as `/gainers` but with `"title": "Top Losers"` and stocks sorted by most negative change percentage.

---

### Most Active Stocks

```http
GET /active?limit={limit}&offset={offset}
```

**Description:** Get stocks with the highest trading volume.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 10 | Items per page (1-50) |
| `offset` | number | No | 0 | Items to skip (≥0) |

**Response:** Same structure as `/gainers` but with `"title": "Most Active"` and stocks sorted by highest volume.

**Stock Data Model:**
```typescript
interface Stock {
  symbol: string;        // Stock ticker symbol
  name: string;          // Company name
  price: number;         // Current stock price
  change: number;        // Price change from previous close
  changePercent: number; // Percentage change from previous close
  volume: number;        // Trading volume
}
```

---

### Spotlight Stock

```http
GET /spotlight?symbol={symbol}
```

**Description:** Get detailed information for a specific stock.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `symbol` | string | No | "AAPL" | Stock ticker symbol (1-10 chars, alphanumeric) |

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 175.43,
    "change": 4.32,
    "changePercent": 2.53,
    "volume": 45678900,
    "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    "marketCap": 2750000000000,
    "peRatio": 28.5,
    "sector": "Technology",
    "industry": "Consumer Electronics"
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

**Data Model:**
```typescript
interface SpotlightStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  description: string;
  marketCap: number;
  peRatio?: number;      // Optional: P/E ratio
  sector?: string;       // Optional: Business sector
  industry?: string;     // Optional: Industry classification
}
```

---

### Financial News

```http
GET /news?q={query}&limit={limit}&offset={offset}
```

**Description:** Get latest financial news with search capability.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | No | "US stocks" | Search query (1-100 chars) |
| `limit` | number | No | 10 | Items per page (1-50) |
| `offset` | number | No | 0 | Items to skip (≥0) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Apple Reports Strong Q4 Earnings Beat Expectations",
      "summary": "Apple Inc. reported better-than-expected earnings for the fourth quarter, driven by strong iPhone sales and services revenue growth.",
      "url": "https://finance.yahoo.com/news/apple-earnings-q4-2024-123456",
      "publishedAt": "2025-10-02T14:30:00.000Z",
      "source": "Yahoo Finance",
      "uuid": "abc123-def456-ghi789"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 5,
    "offset": 0,
    "hasMore": true,
    "nextOffset": 5
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

**Data Model:**
```typescript
interface NewsItem {
  title: string;         // Article headline
  summary: string;       // Article summary/excerpt
  url: string;          // Link to full article
  publishedAt: Date;    // Publication timestamp
  source: string;       // News source/publisher
  uuid: string;         // Unique identifier
}
```

## Error Handling

### HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      "Query parameter 'limit' must be a number",
      "Query parameter 'offset' must be a number"
    ]
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `NOT_FOUND` | 404 | Route not found |
| `MARKET_INDEXES_ERROR` | 500 | Failed to fetch market data |
| `TOP_GAINERS_ERROR` | 500 | Failed to fetch gainers |
| `TOP_LOSERS_ERROR` | 500 | Failed to fetch losers |
| `MOST_ACTIVE_ERROR` | 500 | Failed to fetch active stocks |
| `SPOTLIGHT_STOCK_ERROR` | 500 | Failed to fetch stock details |
| `LATEST_NEWS_ERROR` | 500 | Failed to fetch news |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- **Limit:** 100 requests per minute per IP address
- **Window:** 60 seconds (sliding window)
- **Headers:** Rate limit info included in all responses

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696258425
```

## CORS Policy

### Development
- **Origins:** All origins allowed (`*`)
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Origin, X-Requested-With, Content-Type, Accept, Authorization

### Production
- **Origins:** Configurable via `ALLOWED_ORIGINS` environment variable
- **Credentials:** Supported
- **Preflight:** Cached for 24 hours

## Data Sources

- **Stock Data:** Yahoo Finance API
- **Market Indexes:** Yahoo Finance API
- **News:** Yahoo Finance News API
- **Fallback:** Mock data when external APIs are unavailable

## Performance Considerations

- **Caching:** Responses may be cached for performance
- **Retry Logic:** Automatic retry for failed external API calls
- **Timeout:** 10-second timeout for external API calls
- **Pagination:** Use pagination for large datasets to improve performance

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch top gainers with pagination
const response = await fetch('/gainers?limit=5&offset=0');
const data = await response.json();

if (data.success) {
  console.log('Gainers:', data.data.stocks);
  console.log('Has more:', data.data.pagination.hasMore);
}

// Search for Tesla news
const newsResponse = await fetch('/news?q=Tesla&limit=10');
const newsData = await newsResponse.json();

if (newsData.success) {
  console.log('Tesla news:', newsData.data);
}
```

### cURL Examples

```bash
# Get market indexes
curl "http://localhost:3001/indexes"

# Get first 5 gainers
curl "http://localhost:3001/gainers?limit=5&offset=0"

# Get Apple spotlight
curl "http://localhost:3001/spotlight?symbol=AAPL"

# Search for tech news
curl "http://localhost:3001/news?q=technology&limit=5"
```

### Python

```python
import requests

# Get top gainers
response = requests.get('http://localhost:3001/gainers', params={
    'limit': 5,
    'offset': 0
})

if response.status_code == 200:
    data = response.json()
    if data['success']:
        stocks = data['data']['stocks']
        print(f"Found {len(stocks)} gainers")
```

## Changelog

### v1.1.0
- Added pagination support to all list endpoints
- Enhanced error handling and validation
- Added rate limiting and security middleware
- Improved API documentation

### v1.0.0
- Initial release with basic stock data endpoints
- Market indexes, gainers, losers, active stocks
- News search functionality
- Spotlight stock details