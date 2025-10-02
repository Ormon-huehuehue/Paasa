/**
 * Service layer contracts and interfaces
 */

import type { Request, Response, NextFunction } from 'express';
import type { MarketIndex, Stock, SpotlightStock, NewsItem } from './market';

// Base service interface
export interface IBaseService {
  isHealthy(): Promise<boolean>;
}

// Market data service interface
export interface IMarketDataService extends IBaseService {
  getMarketIndexes(): Promise<MarketIndex[]>;
  getTopGainers(): Promise<Stock[]>;
  getTopLosers(): Promise<Stock[]>;
  getMostActive(): Promise<Stock[]>;
  getSpotlightStock(symbol?: string): Promise<SpotlightStock>;
}

// News service interface
export interface INewsService extends IBaseService {
  getLatestNews(query?: string, limit?: number): Promise<NewsItem[]>;
}

// Cache service interface
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  isAvailable(): boolean;
}

// Logger service interface
export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, error?: Error, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

// Middleware types
export type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;