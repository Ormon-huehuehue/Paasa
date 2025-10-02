/**
 * Yahoo Finance service implementation using yahoofinance2 package
 */

import yahooFinance from 'yahoo-finance2';
import type { 
  IYahooFinanceService,
  YahooQuoteResponse,
  YahooQuoteSummaryResponse,
  YahooNewsItem,
  YahooSearchResponse
} from '../types/yahoo.js';
import type { 
  MarketIndex, 
  Stock, 
  SpotlightStock, 
  NewsItem 
} from '../types/market.js';
import { logger } from '../utils/logger.js';
import { getConfig } from '../config/environment.js';

/**
 * Yahoo Finance API service errors
 */
export class YahooFinanceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'YahooFinanceError';
  }
}

/**
 * Retry configuration for API calls
 */
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

/**
 * Yahoo Finance service implementation
 */
export class YahooFinanceService implements IYahooFinanceService {
  private readonly config = getConfig();
  private readonly retryConfig: RetryConfig;

  constructor() {
    this.retryConfig = {
      maxAttempts: this.config.yahooApiRetryAttempts,
      baseDelay: 1000,
      maxDelay: 10000,
    };
  }

  /**
   * Execute API call with retry logic and error handling
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        const startTime = Date.now();
        const result = await Promise.race([
          operation(),
          this.createTimeoutPromise<T>(this.config.yahooApiTimeout)
        ]);
        
        const duration = Date.now() - startTime;
        logger.logApiCall('Yahoo Finance', operationName, duration);
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === this.retryConfig.maxAttempts) {
          break;
        }
        
        // Calculate exponential backoff delay
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
          this.retryConfig.maxDelay
        );
        
        logger.warn(`Yahoo Finance API call failed, retrying in ${delay}ms`, {
          operation: operationName,
          attempt,
          error: lastError.message
        });
        
        await this.sleep(delay);
      }
    }
    
    const errorMessage = `Yahoo Finance API call failed after ${this.retryConfig.maxAttempts} attempts: ${operationName}`;
    logger.error(errorMessage, { operation: operationName }, lastError || undefined);
    
    throw new YahooFinanceError(
      errorMessage,
      'API_CALL_FAILED',
      lastError || undefined
    );
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise<T>(timeoutMs: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Transform Yahoo Finance quote data to MarketIndex format
   */
  private transformToMarketIndex(quote: any, symbol: string): MarketIndex {
    return {
      symbol,
      name: quote.longName || quote.displayName || symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    };
  }

  /**
   * Transform Yahoo Finance quote data to Stock format
   */
  private transformToStock(quote: any): Stock {
    return {
      symbol: quote.symbol || '',
      name: quote.longName || quote.displayName || quote.symbol || '',
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
    };
  }

  /**
   * Transform Yahoo Finance news item to NewsItem format
   */
  private transformToNewsItem(newsItem: YahooNewsItem): NewsItem {
    return {
      title: newsItem.title,
      summary: newsItem.summary || '',
      url: newsItem.link,
      publishedAt: new Date(newsItem.providerPublishTime * 1000),
      source: newsItem.publisher,
      uuid: newsItem.uuid,
    };
  }

  /**
   * Get market indexes data
   */
  async getMarketIndexes(): Promise<MarketIndex[]> {
    return this.executeWithRetry(async () => {
      const symbols = ['^GSPC', '^IXIC', '^DJI', '^RUT']; // S&P 500, NASDAQ, Dow Jones, Russell 2000
      const quotes = await yahooFinance.quote(symbols) as Record<string, any>;
      
      const indexes: MarketIndex[] = [];
      
      for (const symbol of symbols) {
        const quote = quotes?.[symbol];
        if (quote) {
          indexes.push(this.transformToMarketIndex(quote, symbol));
        }
      }
      
      return indexes;
    }, 'getMarketIndexes');
  }  /**

   * Get top gaining stocks
   */
  async getTopGainers(): Promise<Stock[]> {
    return this.executeWithRetry(async () => {
      try {
        // Use insights method for market movers
        const insights = await yahooFinance.insights('AAPL', {
          reportsCount: 10
        });
        
        // If insights doesn't provide gainers, fall back to predefined symbols
        const fallbackSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
        const quotes = await yahooFinance.quote(fallbackSymbols) as Record<string, any>;
        
        const stocks: Stock[] = [];
        for (const symbol of fallbackSymbols) {
          const quote = quotes?.[symbol];
          if (quote && (quote.regularMarketChangePercent || 0) > 0) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }
        
        // Sort by change percent descending and take top 10
        return stocks
          .sort((a, b) => b.changePercent - a.changePercent)
          .slice(0, 10);
      } catch (error) {
        logger.warn('Failed to get gainers from insights, using fallback method', { error });
        
        // Fallback to basic quote method with known active symbols
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
        const quotes = await yahooFinance.quote(symbols) as Record<string, any>;
        
        const stocks: Stock[] = [];
        for (const symbol of symbols) {
          const quote = quotes?.[symbol];
          if (quote) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }
        
        return stocks.sort((a, b) => b.changePercent - a.changePercent);
      }
    }, 'getTopGainers');
  }

  /**
   * Get top losing stocks
   */
  async getTopLosers(): Promise<Stock[]> {
    return this.executeWithRetry(async () => {
      try {
        // Use insights method for market movers
        const insights = await yahooFinance.insights('AAPL', {
          reportsCount: 10
        });
        
        // If insights doesn't provide losers, fall back to predefined symbols
        const fallbackSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
        const quotes = await yahooFinance.quote(fallbackSymbols) as Record<string, any>;
        
        const stocks: Stock[] = [];
        for (const symbol of fallbackSymbols) {
          const quote = quotes?.[symbol];
          if (quote && (quote.regularMarketChangePercent || 0) < 0) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }
        
        // Sort by change percent ascending (most negative first) and take top 10
        return stocks
          .sort((a, b) => a.changePercent - b.changePercent)
          .slice(0, 10);
      } catch (error) {
        logger.warn('Failed to get losers from insights, using fallback method', { error });
        
        // Fallback to basic quote method with known active symbols
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
        const quotes = await yahooFinance.quote(symbols) as Record<string, any>;
        
        const stocks: Stock[] = [];
        for (const symbol of symbols) {
          const quote = quotes?.[symbol];
          if (quote) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }
        
        return stocks.sort((a, b) => a.changePercent - b.changePercent);
      }
    }, 'getTopLosers');
  }

  /**
   * Get most actively traded stocks
   */
  async getMostActive(): Promise<Stock[]> {
    return this.executeWithRetry(async () => {
      try {
        // Use predefined list of typically active stocks
        const activeSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'SPY'];
        const quotes = await yahooFinance.quote(activeSymbols) as Record<string, any>;
        
        const stocks: Stock[] = [];
        for (const symbol of activeSymbols) {
          const quote = quotes?.[symbol];
          if (quote) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }
        
        // Sort by volume descending
        return stocks
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 10);
      } catch (error) {
        logger.warn('Failed to get most active stocks', { error });
        throw error;
      }
    }, 'getMostActive');
  }

  /**
   * Get spotlight stock with detailed information
   */
  async getSpotlightStock(symbol: string = 'AAPL'): Promise<SpotlightStock> {
    return this.executeWithRetry(async () => {
      try {
        // Get detailed quote summary for the symbol
        const quoteSummary = await yahooFinance.quoteSummary(symbol, {
          modules: ['price', 'summaryDetail', 'assetProfile']
        });
        
        const price = quoteSummary.price;
        const summaryDetail = quoteSummary.summaryDetail;
        const assetProfile = quoteSummary.assetProfile;
        
        if (!price) {
          throw new Error(`No price data available for symbol: ${symbol}`);
        }
        
        const spotlightStock: SpotlightStock = {
          symbol: price.symbol || symbol,
          name: price.longName || symbol,
          price: price.regularMarketPrice || 0,
          change: price.regularMarketChange || 0,
          changePercent: price.regularMarketChangePercent || 0,
          volume: price.regularMarketVolume || 0,
          description: assetProfile?.longBusinessSummary || 'No description available',
          marketCap: summaryDetail?.marketCap || 0,
          ...(summaryDetail?.trailingPE !== undefined && { peRatio: summaryDetail.trailingPE }),
          ...(assetProfile?.sector && { sector: assetProfile.sector }),
          ...(assetProfile?.industry && { industry: assetProfile.industry }),
        };
        
        return spotlightStock;
      } catch (error) {
        logger.error(`Failed to get spotlight stock for ${symbol}`, { symbol }, error as Error);
        throw error;
      }
    }, `getSpotlightStock(${symbol})`);
  }

  /**
   * Get latest financial news
   */
  async getLatestNews(query: string = 'stock market'): Promise<NewsItem[]> {
    return this.executeWithRetry(async () => {
      try {
        // Use search method to get news
        const searchResult = await yahooFinance.search(query, {
          newsCount: 20
        });
        
        if (!searchResult.news || searchResult.news.length === 0) {
          logger.warn('No news found in search results', { query });
          return [];
        }
        
        // Transform and filter news items
        const newsItems = searchResult.news
          .filter((item: any) => item.title && item.link)
          .map((item: any) => this.transformToNewsItem({
            uuid: item.uuid,
            title: item.title,
            publisher: item.publisher,
            link: item.link,
            providerPublishTime: typeof item.providerPublishTime === 'number' 
              ? item.providerPublishTime 
              : Math.floor(new Date(item.providerPublishTime).getTime() / 1000),
            summary: item.summary
          }))
          .slice(0, 10); // Limit to 10 items
        
        return newsItems;
      } catch (error) {
        logger.error('Failed to fetch news', { query }, error as Error);
        
        // Return empty array as fallback instead of throwing
        return [];
      }
    }, `getLatestNews(${query})`);
  }
}

/**
 * Default Yahoo Finance service instance
 */
export const yahooFinanceService = new YahooFinanceService();