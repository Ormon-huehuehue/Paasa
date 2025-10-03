# PAASA - Personal Asset & Stock Analysis

A comprehensive financial application consisting of a TypeScript backend API and a React Native mobile client, designed to provide real-time stock market data, financial news, and portfolio management capabilities.

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
   - Press 'w' for Web based emulation of native code

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
- **Framework**: Express.js (backend) + Expo - React Native (frontend)
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
- 📱 **Responsive Design** - Optimized for various screen sizes and orientations
- ⚡ **Performance Optimized** - Efficient data fetching with client-side caching and error handling
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
- **Image Optimization**: Proper image sizing and caching
- **Bundle Splitting**: Efficient code splitting with Expo Router

---

## 🔗 Integration Guide

### Backend-Client Communication

The client communicates with the backend through a centralized API service:

```typescript
// client/services/apiService.ts
class ApiService {
  private baseURL = 'http://localhost:3001';
  
  async getMarketIndexes(): Promise<MarketIndexResponse> {
    // Implementation with error handling and data transformation
  }
}
```

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

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
bun run build              # Build for production
bun start                  # Start production server
```

### Mobile App Deployment
```bash
cd client
expo build:android         # Build Android APK
expo build:ios            # Build iOS IPA
expo publish              # Publish to Expo
```

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards** (TypeScript, ESLint, Prettier)
4. **Write tests** for new functionality
5. **Commit changes** (`git commit -m 'Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Style Guidelines
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Document complex logic and API interfaces

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

For support and questions:
- **Issues**: Create an issue on GitHub
- **Documentation**: Check the README files in each directory
- **API Documentation**: See backend API endpoints section above

---

**Built with ❤️ using TypeScript, React Native, and modern web technologies**