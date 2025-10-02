# Stock Data Proxy Backend

A TypeScript backend service that acts as a proxy for Yahoo Finance stock data, built with Express and optimized for Bun runtime.

## Features

- 📊 Market data endpoints with pagination support
- 🔍 Stock spotlight with detailed information
- 📰 Financial news aggregation with search
- ⚡ High-performance caching layer
- 🛡️ Security middleware (CORS, rate limiting, validation)
- 📝 Full TypeScript support with strict type checking
- 🏗️ Modular architecture following backend best practices
- 🔄 Graceful error handling and retry logic

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime installed (v1.0+)
- Node.js 18+ (alternative to Bun)

### Installation

```bash
# Install dependencies
bun install

# Copy environment configuration
cp .env.example .env

# Start development server
bun dev

# Or start production server
bun start
```

### Available Scripts

- `bun dev` - Start development server with hot reload
- `bun start` - Start production server
- `bun run build` - Build for production
- `bun run type-check` - Run TypeScript type checking

## API Documentation

Base URL: `http://localhost:3001` (default)

### Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": any,
  "timestamp": string,
  "pagination"?: {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean,
    "nextOffset"?: number
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details"?: any
  },
  "timestamp": string
}
```

### Endpoints

#### 🏥 Health Check

**GET** `/health`

Check if the API is running and healthy.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-02T15:13:45.096Z",
    "uptime": 123.456
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

#### 📈 Market Indexes

**GET** `/indexes`

Get major market indexes (S&P 500, NASDAQ 100, Dow Jones, Russell 2000).

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
    }
  ],
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

#### 📊 Top Gaining Stocks

**GET** `/gainers`

Get top gaining stocks with pagination support.

**Query Parameters:**
- `limit` (optional): Number of items per page (default: 10, max: 50)
- `offset` (optional): Number of items to skip (default: 0)

**Examples:**
```bash
# Get first 5 gainers
GET /gainers?limit=5&offset=0

# Get next 5 gainers
GET /gainers?limit=5&offset=5

# Get all gainers (default pagination)
GET /gainers
```

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

#### 📉 Top Losing Stocks

**GET** `/losers`

Get top losing stocks with pagination support.

**Query Parameters:**
- `limit` (optional): Number of items per page (default: 10, max: 50)
- `offset` (optional): Number of items to skip (default: 0)

**Examples:**
```bash
# Get first 3 losers
GET /losers?limit=3&offset=0

# Get losers 4-6
GET /losers?limit=3&offset=3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Top Losers",
    "pagination": {
      "total": 10,
      "limit": 3,
      "offset": 0,
      "hasMore": true,
      "nextOffset": 3
    },
    "stocks": [
      {
        "symbol": "META",
        "name": "Meta Platforms, Inc.",
        "price": 298.75,
        "change": -6.45,
        "changePercent": -2.11,
        "volume": 34567890
      }
    ]
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

#### 🔥 Most Active Stocks

**GET** `/active`

Get most actively traded stocks with pagination support.

**Query Parameters:**
- `limit` (optional): Number of items per page (default: 10, max: 50)
- `offset` (optional): Number of items to skip (default: 0)

**Examples:**
```bash
# Get first 5 most active stocks
GET /active?limit=5&offset=0

# Get all active stocks (default pagination)
GET /active
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Most Active",
    "pagination": {
      "total": 12,
      "limit": 5,
      "offset": 0,
      "hasMore": true,
      "nextOffset": 5
    },
    "stocks": [
      {
        "symbol": "SPY",
        "name": "SPDR S&P 500 ETF Trust",
        "price": 428.50,
        "change": 2.15,
        "changePercent": 0.50,
        "volume": 89012345
      }
    ]
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

#### ⭐ Spotlight Stock

**GET** `/spotlight`

Get detailed information for a featured stock.

**Query Parameters:**
- `symbol` (optional): Stock symbol (default: "AAPL")

**Examples:**
```bash
# Get Apple spotlight
GET /spotlight

# Get Microsoft spotlight
GET /spotlight?symbol=MSFT

# Get Tesla spotlight
GET /spotlight?symbol=TSLA
```

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
    "description": "Apple Inc. designs, manufactures, and markets smartphones...",
    "marketCap": 2750000000000,
    "peRatio": 28.5,
    "sector": "Technology",
    "industry": "Consumer Electronics"
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

#### 📰 Financial News

**GET** `/news`

Get latest financial news with search and pagination support.

**Query Parameters:**
- `q` (optional): Search query (default: "US stocks")
- `limit` (optional): Number of items per page (default: 10, max: 50)
- `offset` (optional): Number of items to skip (default: 0)

**Examples:**
```bash
# Get latest US stocks news
GET /news

# Search for tech news
GET /news?q=technology

# Get first 5 Tesla news items
GET /news?q=Tesla&limit=5&offset=0

# Get next 5 Tesla news items
GET /news?q=Tesla&limit=5&offset=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Apple Reports Strong Q4 Earnings",
      "summary": "Apple Inc. reported better-than-expected earnings...",
      "url": "https://finance.yahoo.com/news/apple-earnings-123456",
      "publishedAt": "2025-10-02T14:30:00.000Z",
      "source": "Yahoo Finance",
      "uuid": "abc123-def456-ghi789"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true,
    "nextOffset": 10
  },
  "timestamp": "2025-10-02T15:13:45.096Z"
}
```

---

### Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Limit:** 100 requests per minute per IP address
- **Headers:** Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `NOT_FOUND` | Route not found |
| `MARKET_INDEXES_ERROR` | Failed to fetch market indexes |
| `TOP_GAINERS_ERROR` | Failed to fetch top gainers |
| `TOP_LOSERS_ERROR` | Failed to fetch top losers |
| `MOST_ACTIVE_ERROR` | Failed to fetch most active stocks |
| `SPOTLIGHT_STOCK_ERROR` | Failed to fetch spotlight stock |
| `LATEST_NEWS_ERROR` | Failed to fetch news |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

### CORS Support

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Development:** All origins allowed (`*`)
- **Production:** Configurable via `ALLOWED_ORIGINS` environment variable
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Origin, X-Requested-With, Content-Type, Accept, Authorization

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Yahoo Finance API Configuration
YAHOO_API_TIMEOUT=10000
YAHOO_API_RETRY_ATTEMPTS=3

# CORS Configuration (production only)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=info
```

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

See [src/README.md](src/README.md) for detailed information about the codebase organization.

## Development

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

### Type Checking

```bash
# Check types
bun run type-check

# Check types in watch mode
bun run type-check --watch
```

### Building for Production

```bash
# Build the application
bun run build

# Start production server
bun start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
