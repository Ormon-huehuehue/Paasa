export const MarketIndexes = [
  { name: 'S&P 500', value: 5200.45, change: 0.75 },
  { name: 'NASDAQ 100', value: 18200.12, change: -0.30 },
  { name: 'Dow Jones', value: 39000.88, change: 1.10 },
];

export const TopGainers = [
  { ticker: 'SMCI', exchange: 'NASDAQ', price: 850.23, change: 12.50 },
  { ticker: 'NVDA', exchange: 'NASDAQ', price: 920.10, change: 8.75 },
  { ticker: 'AMD', exchange: 'NASDAQ', price: 180.50, change: 6.20 },
  { ticker: 'GOOGL', exchange: 'NASDAQ', price: 170.30, change: 4.15 },
  { ticker: 'MSFT', exchange: 'NASDAQ', price: 430.70, change: 3.90 },
  { ticker: 'AMZN', exchange: 'NASDAQ', price: 185.90, change: 3.50 },
  { ticker: 'TSLA', exchange: 'NASDAQ', price: 180.20, change: 3.10 },
  { ticker: 'META', exchange: 'NASDAQ', price: 500.40, change: 2.80 },
  { ticker: 'AAPL', exchange: 'NASDAQ', price: 175.60, change: 2.50 },
  { ticker: 'NFLX', exchange: 'NASDAQ', price: 620.80, change: 2.30 },
];

export const TopLosers = [
  { ticker: 'INTC', exchange: 'NASDAQ', price: 35.10, change: -5.80 },
  { ticker: 'QCOM', exchange: 'NASDAQ', price: 160.20, change: -4.10 },
  { ticker: 'PYPL', exchange: 'NASDAQ', price: 60.50, change: -3.50 },
  { ticker: 'SBUX', exchange: 'NASDAQ', price: 85.70, change: -2.90 },
  { ticker: 'ZM', exchange: 'NASDAQ', price: 65.30, change: -2.70 },
  { ticker: 'ROKU', exchange: 'NASDAQ', price: 55.90, change: -2.50 },
  { ticker: 'SNAP', exchange: 'NASDAQ', price: 12.80, change: -2.30 },
  { ticker: 'PTON', exchange: 'NASDAQ', price: 4.10, change: -2.10 },
  { ticker: 'COIN', exchange: 'NASDAQ', price: 200.10, change: -1.90 },
  { ticker: 'SHOP', exchange: 'NASDAQ', price: 75.40, change: -1.70 },
];

export const ActivelyTrading = [
  { ticker: 'TSLA', exchange: 'NASDAQ', price: 180.20, change: 3.10 },
  { ticker: 'NVDA', exchange: 'NASDAQ', price: 920.10, change: 8.75 },
  { ticker: 'AAPL', exchange: 'NASDAQ', price: 175.60, change: 2.50 },
  { ticker: 'AMZN', exchange: 'NASDAQ', price: 185.90, change: 3.50 },
  { ticker: 'MSFT', exchange: 'NASDAQ', price: 430.70, change: 3.90 },
  { ticker: 'GOOGL', exchange: 'NASDAQ', price: 170.30, change: 4.15 },
  { ticker: 'META', exchange: 'NASDAQ', price: 500.40, change: 2.80 },
  { ticker: 'AMD', exchange: 'NASDAQ', price: 180.50, change: 6.20 },
  { ticker: 'SMCI', exchange: 'NASDAQ', price: 850.23, change: 12.50 },
  { ticker: 'NFLX', exchange: 'NASDAQ', price: 620.80, change: 2.30 },
];

export const StockSpotlightData = {
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Nvidia_logo.svg/1200px-Nvidia_logo.svg.png',
  name: 'NVIDIA Corporation',
  ticker: 'NVDA',
  description: 'NVIDIA Corporation provides graphics, and media processing communications devices. The Company offers integrated circuits that are used in a variety of communications platforms, such as personal computers, workstations, and other handheld devices.',
  price: 920.10,
  change: 8.75,
};

export const NewsHeadlines = [
  {
    id: '1',
    title: 'NVIDIA Stock Soars on AI Chip Demand',
    source: 'Reuters',
    timestamp: '2 hours ago',
    url: 'https://www.reuters.com/markets/companies/NVDA.O/',
  },
  {
    id: '2',
    title: 'S&P 500 Reaches New All-Time High',
    source: 'Bloomberg',
    timestamp: '4 hours ago',
    url: 'https://www.bloomberg.com/markets/stocks',
  },
  {
    id: '3',
    title: 'Tech Giants Report Strong Earnings',
    source: 'Wall Street Journal',
    timestamp: 'Yesterday',
    url: 'https://www.wsj.com/news/markets',
  },
  {
    id: '4',
    title: 'Market Volatility Expected Ahead of Fed Meeting',
    source: 'Financial Times',
    timestamp: '2 days ago',
    url: 'https://www.ft.com/markets',
  },
  {
    id: '5',
    title: 'New Innovations in Renewable Energy Sector',
    source: 'TechCrunch',
    timestamp: '3 days ago',
    url: 'https://techcrunch.com/',
  },
  {
    id: '6',
    title: 'Global Economy Shows Signs of Recovery',
    source: 'The Economist',
    timestamp: '4 days ago',
    url: 'https://www.economist.com/',
  },
];

import { Stock } from '../types/Stock';

export const trendingStocks: Stock[] = [
  { symbol: 'BRRI', name: 'Bank Rakyat Indonesia', price: 8600, change: 50, changePercent: 3.23, color: '#FF9500' },
  { symbol: 'ARB', name: 'Arwana', price: 8600, change: 50, changePercent: 3.23, color: '#FF9500' },
  { symbol: 'FSX', name: 'First Media', price: 8600, change: 50, changePercent: 3.23, color: '#3B82F6' },
  { symbol: 'TLK', name: 'Telkom', price: 8600, change: 50, changePercent: 3.23, color: '#EF4444' },
];

export const watchlist: Stock[] = [
  { symbol: 'DHDI', name: 'PT. Duatiga Pertama', price: 8600, change: 80, changePercent: 3.23, color: '#FFD700', positive: true },
  { symbol: 'AMRI', name: 'PT. Atma Merapi', price: 2421, change: -121, changePercent: -20.6, color: '#EF4444', positive: false },
  { symbol: 'ODD', name: 'PT. Okufo Dokuri', price: 5300, change: 31, changePercent: 2.23, color: '#8B5CF6', positive: true },
  { symbol: 'PYQ', name: 'PT. Pirmas Yosque', price: 3867, change: -71, changePercent: -41.1, color: '#06B6D4', positive: false },
  { symbol: 'DAN', name: 'PT. Danan', price: 6600, change: 0, changePercent: 0, color: '#10B981', positive: true },
];