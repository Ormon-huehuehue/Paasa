# Source Code Structure

This directory contains the organized source code for the stock data proxy backend following senior backend engineering practices, optimized for Bun runtime.

## Directory Structure

```
src/
├── controllers/          # HTTP request handlers
├── services/            # Business logic and external API integration
├── routes/              # Express route definitions
├── middleware/          # Custom middleware functions
├── config/              # Configuration management
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Type Definitions

The `types/` directory contains all TypeScript interfaces and type definitions:

- `market.ts` - Market data types (MarketIndex, Stock, SpotlightStock, NewsItem)
- `api.ts` - API response types (ApiResponse, ErrorResponse)
- `yahoo.ts` - Yahoo Finance service contracts and API types
- `config.ts` - Configuration types (AppConfig, DatabaseConfig, CacheConfig)
- `services.ts` - Service layer contracts and interfaces
- `constants.ts` - Application constants, enums, and default values
- `index.ts` - Central export for all types

## Import Paths

TypeScript path mapping is configured for clean imports:

```typescript
import { MarketIndex, Stock } from '@/types';
import { IYahooFinanceService } from '@/types/yahoo';
```

## Requirements Addressed

This structure addresses the following requirements:

- **3.1**: TypeScript compliance with proper type definitions
- **3.2**: Proper type imports for external libraries
- **3.3**: Explicit type annotations and interface definitions
- **4.1**: Organized directory structure with separation of concerns
- **4.2**: Single responsibility principle for each module
## Bun
 Runtime

This project is configured to use Bun as the JavaScript runtime for optimal performance:

- **Development**: `bun --watch src/index.ts`
- **Production**: `bun run src/index.ts`
- **Build**: `bun build src/index.ts --outdir ./dist --target bun`
- **Type Check**: `bun run type-check`

Bun provides native TypeScript support, fast startup times, and built-in bundling capabilities.