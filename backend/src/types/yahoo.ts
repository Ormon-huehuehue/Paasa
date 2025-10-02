/**
 * Yahoo Finance API type definitions and service contracts
 */

import type { MarketIndex, Stock, SpotlightStock, NewsItem } from './market';

export interface IYahooFinanceService {
  getMarketIndexes(): Promise<MarketIndex[]>;
  getTopGainers(): Promise<Stock[]>;
  getTopLosers(): Promise<Stock[]>;
  getMostActive(): Promise<Stock[]>;
  getSpotlightStock(symbol?: string): Promise<SpotlightStock>;
  getLatestNews(query?: string): Promise<NewsItem[]>;
}



// Yahoo Finance API response types (based on yahoofinance2 package)
export interface YahooQuoteResponse {
  symbol: string;
  longName?: string;
  displayName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume?: number;
}

export interface YahooQuoteSummaryResponse {
  assetProfile?: {
    longBusinessSummary?: string;
    sector?: string;
    industry?: string;
  };
  price?: {
    symbol: string;
    longName?: string;
    regularMarketPrice: number;
  };
  summaryDetail?: {
    marketCap?: number;
    trailingPE?: number;
  };
}

export interface YahooNewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  summary?: string;
}

export interface YahooSearchResponse {
  news: YahooNewsItem[];
}