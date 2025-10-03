# PAASA - Intern Assignment

A comprehensive financial application consisting of a TypeScript backend API and a React Native mobile client, designed to provide real-time stock market data, financial news, and portfolio management capabilities.

## 📸 Screenshots
<img width="1865" height="1044" alt="Paasa Demo" src="https://github.com/user-attachments/assets/5298e451-01e9-4408-a18c-46d36f869b27" />


## 🏗️ Project Architecture

This project follows a modern full-stack architecture with clear separation of concerns:

```
paasa/
├── backend/          # TypeScript Express API Server
│   ├── src/          # Source code
│   ├── .env.example  # Environment configuration template
│   └── package.json  # Backend dependencies
├── client/           # React Native Mobile App
│   ├── app/          # Expo Router pages
│   ├── components/   # Reusable UI components
│   ├── services/     # API integration layer
│   ├── hooks/        # Custom React hooks
│   └── package.json  # Client dependencies
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Backend**: [Bun](https://bun.sh/) runtime (v1.0+) or Node.js 18+
- **Client**: [Expo CLI](https://docs.expo.dev/get-started/installation/) and React Native development environment
- **Mobile Testing**: Expo Go app on your device or iOS/Android simulator

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:Ormon-huehuehue/Paasa.git
   cd paasa
   ```

2. **Backend Setup**
   ```bash
   cd backend
   bun install                    # Install dependencies
   cp .env.example .env          # Configure environment
   bun run dev                       # Start development server (port 3000)
   ```

3. **Client Setup** (in a new terminal)
   ```bash
   cd client
   bun install                   # Install dependencies
   bun start                     # Start Expo development server
   ```

4. **Run on Device/Simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for Web based emulation of native code

---

# 🔧 Backend API Documentation

## Overview

A TypeScript backend service that acts as a proxy for Yahoo Finance stock data, built with Express and optimized for Bun runtime.

### Key Features

- 📊 **Market Data Endpoints** - Real-time stock prices, market indexes, and trading volumes
- 🔍 **Stock Spotlight** - Detailed company information with financial metrics
- 📰 **Financial News** - Aggregated news with search and pagination
- ⚡ **Retry Logic & Error Handling** - Robust error handling
- 🛡️ **Security Middleware** - CORS, rate limiting, input validation
- 📝 **Full TypeScript Support** - Strict type checking and IntelliSense
- 🏗️ **Modular Architecture** - Clean separation of concerns
- 🔄 **Graceful Error Handling** - Comprehensive error handling with retry logic

### Technology Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Data Source**: Yahoo Finance API

## API Endpoints

**Base URL**: `http://localhost:3001`

### Response Format

All API responses follow a consistent structure:

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

### Core Endpoints
Verify API status and uptime.

#### 📈 Market Indexes
```http
GET /indexes
```
Get major market indexes (S&P 500, NASDAQ 100, Dow Jones, Russell 2000).

#### 📊 Stock Lists
```http
GET /gainers?limit=5&offset=0    # Top gaining stocks
GET /losers?limit=5&offset=0     # Top losing stocks  
GET /active?limit=5&offset=0     # Most active stocks
```

#### ⭐ Stock Spotlight
```http
GET /spotlight?symbol=AAPL        # Detailed stock information
```

#### 📰 Financial News
```http
GET /news?q=tech&limit=5&offset=0    # Search financial news
```

### Error Handling

The API implements comprehensive error handling with specific error codes:

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | Too many requests (100/min limit) |
| `MARKET_INDEXES_ERROR` | Failed to fetch market data |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

### Security Features

- **Rate Limiting**: 100 requests per minute per IP
- **CORS Support**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request parameter validation
- **Error Sanitization**: Secure error responses without sensitive data

## Backend Project Structure

```
backend/src/
├── controllers/      # HTTP request handlers
│   ├── marketController.ts    # Market data endpoints
│   └── newsController.ts      # News endpoints
├── services/         # Business logic layer
│   └── yahooFinanceService.ts # Yahoo Finance integration
├── routes/          # Express route definitions
│   ├── marketRoutes.ts        # Market data routes
│   └── newsRoutes.ts          # News routes
├── middleware/      # Custom middleware functions
│   ├── errorHandler.ts        # Global error handling
│   ├── security.ts            # Security middleware
│   └── validation.ts          # Input validation
├── config/          # Configuration management
│   └── environment.ts         # Environment variables
├── types/           # TypeScript type definitions
│   ├── market.ts             # Market data types
│   ├── api.ts                # API response types
│   ├── yahoo.ts              # Yahoo Finance types
│   ├── config.ts             # Configuration types
│   └── services.ts           # Service interfaces
└── utils/           # Utility functions
    ├── logger.ts             # Structured logging
    └── pagination.ts         # Pagination helpers
```

### Environment Configuration

Create `.env` file in the backend directory:



```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Yahoo Finance API Configuration
YAHOO_API_TIMEOUT=10000
YAHOO_API_RETRY_ATTEMPTS=3

# CORS Configuration (production)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### Development Commands

```bash
# Development server with hot reload
bun dev

# Production server
bun start

# Type checking
bun run type-check

# Build for production
bun run build

# Run tests
bun test
```

---

# 📱 Mobile Client Documentation

## Overview

A modern React Native mobile application built with Expo, featuring real-time stock market data, financial news, and an intuitive user interface optimized for mobile devices.

### Key Features

- 🎨 **Modern UI/UX** - Dark theme with gradient backgrounds and smooth animations
- 📊 **Real-time Market Data** - Live stock prices, market indexes, and trading information
- 📰 **Financial News Feed** - Latest financial news with search and filtering
- ⭐ **Stock Spotlight** - Featured stock with detailed company information
- 🔄 **Pull-to-Refresh** - Intuitive data refreshing across all screens
- ⚡ **Performance Optimized** - Efficient data fetching error handling
- 🎭 **Animated Splash Screen** - Professional app loading experience

### Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Animations**: React Native Reanimated
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **UI Components**: Custom components with React Native primitives

## App Structure

### Navigation Architecture

The app uses Expo Router with a tab-based navigation structure:

```
app/
├── _layout.tsx           # Root layout with splash screen
├── index.tsx             # Welcome/onboarding screen
├── (tabs)/               # Tab navigation group
│   ├── _layout.tsx       # Tab layout configuration
│   ├── explore.tsx       # Main dashboard (market overview)
│   ├── stocks.tsx        # Stock lists and search
│   ├── news.tsx          # Financial news feed
│   └── funds.tsx         # Portfolio/profile section
└── modal.tsx             # Modal screens
```

### Component Architecture

```
components/
├── AnimatedSplashScreen.tsx    # App loading animation
├── BalanceSection.tsx          # Portfolio balance display
├── BottomNavigation.tsx        # Custom tab bar
├── MarketSnapshot.tsx          # Market indexes overview
├── NewsSection.tsx             # News feed component
├── StockCard.tsx               # Individual stock display
├── StockListTabs.tsx           # Tabbed stock lists
├── StockSpotlight.tsx          # Featured stock component
└── WatchlistSection.tsx        # User watchlist
```

### Custom Hooks

```
hooks/
├── useMarketIndexes.ts         # Market indexes data
├── useNewsData.ts              # Financial news data
├── useSpotlightStock.ts        # Featured stock data
└── useStockData.ts             # Stock lists data
```

### Services Layer

```
services/
└── apiService.ts               # Backend API integration
```

## Screen Descriptions

### 🏠 Explore (Main Dashboard)
- **Market Snapshot**: Real-time market indexes (S&P 500, NASDAQ, Dow Jones)
- **Stock Spotlight**: Featured stock with detailed information and expandable description
- **Balance Section**: Portfolio overview and account information
- **Watchlist**: User's tracked stocks (currently shows empty state)

### 📈 Stocks
- **Tabbed Interface**: Top Gainers, Top Losers, Most Active
- **Real-time Data**: Live stock prices with change indicators
- **Pagination**: Load more stocks with pull-to-refresh
- **Color-coded Changes**: Green for gains, red for losses

### 📰 News
- **Financial News Feed**: Latest market news and analysis
- **Search Functionality**: Filter news by keywords
- **Source Attribution**: News source and publication time
- **Infinite Scroll**: Load more articles as you scroll

### 💰 Funds (Profile)
- **Portfolio Balance**: Account balance and performance metrics
- **Profile Information**: User details and account information
- **Hire Me Section**: Custom branding with animated image

## Key Features Implementation

### 🎨 Animated Splash Screen
- **Logo Animation**: Scaling and pulsing effects
- **Text Animations**: Staggered fade-in with slide transitions
- **Loading Indicators**: Animated dots showing progress
- **Smooth Transitions**: Professional app loading experience

### 📊 Real-time Data Management
- **Custom Hooks**: Centralized data fetching logic
- **Error Handling**: Comprehensive error states with retry options
- **Loading States**: Multiple loading indicators (initial, refreshing, loading more)
- **Client-side Caching**: Custom hooks implement intelligent data caching to reduce API calls

### 🎭 Animations & Interactions
- **React Native Reanimated**: 60fps animations throughout the app
- **Gesture Handling**: Smooth touch interactions and feedback
- **Transition Effects**: Page transitions and component animations
- **Micro-interactions**: Button presses, loading states, and visual feedback

### 🔄 Data Flow Architecture

```
User Interaction → Custom Hook → API Service → Backend API → Yahoo Finance
                                      ↓
UI Component ← State Update ← Data Transform ← API Response
```

## Development Setup

### Prerequisites
- Node.js 18+ or Bun runtime
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio (for emulators)
- Expo Go app (for physical device testing)

### Installation
```bash
cd client
bun install                 # Install dependencies
bun start                   # Start Expo development server
```

### Development Commands
```bash
# Start development server
bun start

# Run on iOS simulator
bun run ios

# Run on Android emulator  
bun run android

# Run on web browser
bun run web

# Type checking
npx tsc --noEmit
```

### Environment Configuration

The client automatically connects to the backend API. Ensure the backend is running on `http://localhost:3001` or update the API base URL in `client/config/api.ts`.

## UI/UX Design Principles

### 🎨 Visual Design
- **Dark Theme**: Professional dark color scheme with gradient backgrounds
- **Color Palette**: 
  - Primary: `#10B981` (Green for positive changes)
  - Danger: `#EF4444` (Red for negative changes)
  - Background: `#0B0F1A` to `#1E293B` (Gradient)
  - Text: `#FFFFFF` (Primary), `#9CA3AF` (Secondary)

### 📱 Mobile-First Approach
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Performance**: Optimized for mobile devices with efficient rendering
- **Accessibility**: Proper contrast ratios and readable font sizes

### ⚡ Performance Optimizations
- **Lazy Loading**: Components and data loaded on demand
- **Memoization**: Prevent unnecessary re-renders
- **Bundle Splitting**: Efficient code splitting with Expo Router


### Data Flow
1. **User Interaction**: User navigates to a screen or pulls to refresh
2. **Custom Hook**: React hook triggers API call through ApiService
3. **API Service**: Formats request and calls backend endpoint
4. **Backend API**: Processes request and fetches data from Yahoo Finance
5. **Data Transform**: Backend transforms and validates data
6. **Client Update**: Hook updates component state with new data
7. **UI Render**: Component re-renders with updated information

### Error Handling Strategy
- **Network Errors**: Automatic retry with exponential backoff
- **API Errors**: User-friendly error messages with retry options
- **Validation Errors**: Form validation and input sanitization
- **Fallback States**: Graceful degradation when services are unavailable

---




## Difficulties in Implementation and Learning

The most complex task encountered when dealing with external API integration was implementing pagination for Yahoo APIs.

    The Problem: The Yahoo APIs themselves often did not support any standard pagination parameters by default, such as limit (items per page) or offset (starting point). Without these, a standard request would simply return the full dataset, which is inefficient and unmanageable for large results.

    The Custom Solution Required: This forced the implementation of custom, client-side pagination logic. This meant:
        Fetching the Full Dataset: The initial request had to retrieve all data points (or as many as possible within a practical limit).

        Client-Side Indexing and Slicing: The data received from Yahoo had to be loaded into memory and then manually "sliced" into pages based on the desired limit and offset values determined by the application.

        Dynamic Client-Side Rendering: For all subsequent requests (e.g., clicking "Next Page"), the application calculated the new index range and dynamically rendered the appropriate subset of the already-loaded data on the client side.

    # The pagination parameters:
       - First load: limit=2, offset=0 → Gets items 0-1
       - Second load (View More): limit=2, offset=2 → Gets items 2-3
       - Third load (View More): limit=2, offset=4 → Gets items 4-5

    #Why this approach:
      ✅ Fresh data: Each "View More" gets the latest news from Yahoo Finance
      ✅ Memory efficient: Doesn't store large amounts of data upfront
      ✅ Real pagination: True server-side pagination with offset/limit