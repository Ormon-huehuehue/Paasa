# Stock Data Proxy Backend

A TypeScript backend service that acts as a proxy for Yahoo Finance stock data, built with Express and optimized for Bun runtime.

## Features

- Market data endpoints (indexes, gainers, losers, active stocks)
- Stock spotlight with detailed information
- Financial news aggregation
- Optional Redis caching for performance
- Full TypeScript support with strict type checking
- Organized architecture following backend best practices

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime installed

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

## API Endpoints

- `GET /indexes` - Market indexes (S&P 500, NASDAQ, etc.)
- `GET /gainers` - Top gaining stocks
- `GET /losers` - Top losing stocks
- `GET /active` - Most actively traded stocks
- `GET /spotlight?symbol=AAPL` - Featured stock details
- `GET /news?q=tech` - Latest financial news

## Project Structure

See [src/README.md](src/README.md) for detailed information about the codebase organization.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
