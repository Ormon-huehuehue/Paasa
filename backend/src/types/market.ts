/**
 * Market data type definitions
 */

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface SpotlightStock extends Stock {
  description: string;
  marketCap: number;
  peRatio?: number;
  sector?: string;
  industry?: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
  uuid?: string;
}

export interface MarketMoversResponse {
  title: string;
  stocks: Stock[];
}