/**
 * Yahoo Finance service implementation using yahoofinance2 package
 */

import yahooFinance from 'yahoo-finance2';
import type {
  IYahooFinanceService,
  YahooNewsItem
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
      const quotes = await yahooFinance.quote(symbols);
      const indexes: MarketIndex[] = [];

      quotes.forEach(quote => {
        const symbol = quote.symbol;

        if (quote && symbol) {
          indexes.push(this.transformToMarketIndex(quote, symbol));
        }
      })

      return indexes;
    }, 'getMarketIndexes');
  }  /**

   * Get top gaining stocks
   */
  async getTopGainers(): Promise<Stock[]> {
    return this.executeWithRetry(async () => {
      // Use a diverse set of popular stocks to get real market data
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'CRM'];

      logger.info('Fetching quotes for symbols', { symbols });

      // Try different approaches to get quote data
      let quotes: any;

      try {
        // First try: get quotes as array response
        quotes = await yahooFinance.quote(symbols);
        logger.info('Yahoo Finance quotes response (array format)', {
          isArray: Array.isArray(quotes),
          length: Array.isArray(quotes) ? quotes.length : 'N/A',
          type: typeof quotes,
          keys: typeof quotes === 'object' ? Object.keys(quotes) : 'N/A'
        });

        // If quotes is an array, convert to object keyed by symbol
        if (Array.isArray(quotes)) {
          const quotesObj: Record<string, any> = {};
          quotes.forEach((quote: any) => {
            if (quote && quote.symbol) {
              quotesObj[quote.symbol] = quote;
            }
          });
          quotes = quotesObj;
        }

      } catch (error) {
        logger.warn('Failed to get quotes in batch, trying individual requests', { error: (error as Error).message });

        // Fallback: get quotes individually
        quotes = {};
        for (const symbol of symbols.slice(0, 3)) { // Limit to first 3 to avoid rate limits
          try {
            const singleQuote = await yahooFinance.quote(symbol);
            logger.info(`Individual quote for ${symbol}`, { quote: singleQuote });
            quotes[symbol] = singleQuote;
          } catch (singleError) {
            logger.warn(`Failed to get quote for ${symbol}`, { error: (singleError as Error).message });
          }
        }
      }

      const stocks: Stock[] = [];

      // Process the quotes
      for (const symbol of symbols) {
        const quote = quotes?.[symbol];
        if (quote) {
          logger.info(`Processing quote for ${symbol}`, {
            symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            volume: quote.regularMarketVolume,
            fullQuote: quote
          });

          const transformedStock = this.transformToStock({ ...quote, symbol });
          stocks.push(transformedStock);
        } else {
          logger.warn(`No quote data for symbol: ${symbol}`);
        }
      }

      logger.info('Processed stocks', {
        stocksCount: stocks.length,
        stocks: stocks.map(s => ({
          symbol: s.symbol,
          price: s.price,
          changePercent: s.changePercent
        }))
      });

      // If no stocks were processed, return mock data for demo purposes
      if (stocks.length === 0) {
        logger.warn('No real stock data available, returning mock data');
        return this.getMockGainers();
      }

      // Sort by change percent descending (highest gainers first)
      return stocks
        .sort((a, b) => b.changePercent - a.changePercent);
    }, 'getTopGainers');
  }

  /**
   * Get mock gainers data for demo purposes
   */
  private getMockGainers(): Stock[] {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 4.32,
        changePercent: 2.53,
        volume: 45678900
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 338.11,
        change: 7.89,
        changePercent: 2.39,
        volume: 23456789
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 138.21,
        change: 2.87,
        changePercent: 2.12,
        volume: 34567890
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 432.65,
        change: 8.43,
        changePercent: 1.99,
        volume: 56789012
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 248.50,
        change: 4.12,
        changePercent: 1.68,
        volume: 67890123
      },
      {
        symbol: 'AMD',
        name: 'Advanced Micro Devices, Inc.',
        price: 102.34,
        change: 1.89,
        changePercent: 1.88,
        volume: 45678901
      },
      {
        symbol: 'CRM',
        name: 'Salesforce, Inc.',
        price: 216.78,
        change: 3.21,
        changePercent: 1.50,
        volume: 12345678
      },
      {
        symbol: 'ADBE',
        name: 'Adobe Inc.',
        price: 487.23,
        change: 6.45,
        changePercent: 1.34,
        volume: 23456789
      },
      {
        symbol: 'NFLX',
        name: 'Netflix, Inc.',
        price: 385.20,
        change: 4.80,
        changePercent: 1.26,
        volume: 34567890
      },
      {
        symbol: 'PYPL',
        name: 'PayPal Holdings, Inc.',
        price: 58.45,
        change: 0.67,
        changePercent: 1.16,
        volume: 56789012
      },
      {
        symbol: 'INTC',
        name: 'Intel Corporation',
        price: 23.45,
        change: 0.25,
        changePercent: 1.08,
        volume: 67890123
      },
      {
        symbol: 'CSCO',
        name: 'Cisco Systems, Inc.',
        price: 47.89,
        change: 0.48,
        changePercent: 1.01,
        volume: 78901234
      }
    ];
  }

  /**
   * Get mock losers data for demo purposes
   */
  private getMockLosers(): Stock[] {
    return [
      {
        symbol: 'META',
        name: 'Meta Platforms, Inc.',
        price: 298.75,
        change: -6.45,
        changePercent: -2.11,
        volume: 34567890
      },
      {
        symbol: 'NFLX',
        name: 'Netflix, Inc.',
        price: 385.20,
        change: -7.80,
        changePercent: -1.98,
        volume: 23456789
      },
      {
        symbol: 'AMD',
        name: 'Advanced Micro Devices, Inc.',
        price: 102.34,
        change: -1.89,
        changePercent: -1.81,
        volume: 45678901
      },
      {
        symbol: 'CRM',
        name: 'Salesforce, Inc.',
        price: 216.78,
        change: -3.21,
        changePercent: -1.46,
        volume: 12345678
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        price: 127.89,
        change: -1.67,
        changePercent: -1.29,
        volume: 56789012
      },
      {
        symbol: 'PYPL',
        name: 'PayPal Holdings, Inc.',
        price: 58.45,
        change: -0.78,
        changePercent: -1.32,
        volume: 45678901
      },
      {
        symbol: 'INTC',
        name: 'Intel Corporation',
        price: 23.45,
        change: -0.32,
        changePercent: -1.35,
        volume: 56789012
      },
      {
        symbol: 'CSCO',
        name: 'Cisco Systems, Inc.',
        price: 47.89,
        change: -0.67,
        changePercent: -1.38,
        volume: 67890123
      },
      {
        symbol: 'IBM',
        name: 'International Business Machines Corporation',
        price: 142.56,
        change: -2.14,
        changePercent: -1.48,
        volume: 78901234
      },
      {
        symbol: 'ORCL',
        name: 'Oracle Corporation',
        price: 108.23,
        change: -1.89,
        changePercent: -1.72,
        volume: 89012345
      }
    ];
  }

  /**
   * Get mock active stocks data for demo purposes
   */
  private getMockActive(): Stock[] {
    return [
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        price: 428.50,
        change: 2.15,
        changePercent: 0.50,
        volume: 89012345
      },
      {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        price: 367.89,
        change: 1.23,
        changePercent: 0.34,
        volume: 78901234
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 4.32,
        changePercent: 2.53,
        volume: 67890123
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 248.50,
        change: 4.12,
        changePercent: 1.68,
        volume: 56789012
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 432.65,
        change: 8.43,
        changePercent: 1.99,
        volume: 45678901
      },
      {
        symbol: 'AMD',
        name: 'Advanced Micro Devices, Inc.',
        price: 102.34,
        change: 1.89,
        changePercent: 1.88,
        volume: 43567890
      },
      {
        symbol: 'META',
        name: 'Meta Platforms, Inc.',
        price: 298.75,
        change: -6.45,
        changePercent: -2.11,
        volume: 42345678
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 338.11,
        change: 7.89,
        changePercent: 2.39,
        volume: 41234567
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 138.21,
        change: 2.87,
        changePercent: 2.12,
        volume: 40123456
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        price: 127.89,
        change: -1.67,
        changePercent: -1.29,
        volume: 39012345
      },
      {
        symbol: 'NFLX',
        name: 'Netflix, Inc.',
        price: 385.20,
        change: -7.80,
        changePercent: -1.98,
        volume: 38901234
      },
      {
        symbol: 'CRM',
        name: 'Salesforce, Inc.',
        price: 216.78,
        change: -3.21,
        changePercent: -1.46,
        volume: 37890123
      }
    ];
  }

  /**
   * Get top losing stocks
   */
  async getTopLosers(): Promise<Stock[]> {
    return this.executeWithRetry(async () => {
      try {
        // Use a diverse set of popular stocks to get real market data
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'CRM'];
        const quotes = await yahooFinance.quote(symbols);

        // Handle both array and object responses
        let quotesObj: Record<string, any> = {};
        if (Array.isArray(quotes)) {
          quotes.forEach((quote: any) => {
            if (quote && quote.symbol) {
              quotesObj[quote.symbol] = quote;
            }
          });
        } else {
          quotesObj = quotes as Record<string, any>;
        }

        const stocks: Stock[] = [];
        for (const symbol of symbols) {
          const quote = quotesObj?.[symbol];
          if (quote) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }

        // If no real data, return mock data
        if (stocks.length === 0) {
          logger.warn('No real stock data available for losers, returning mock data');
          return this.getMockLosers();
        }

        // Sort by change percent ascending (lowest/most negative first)
        return stocks
          .sort((a, b) => a.changePercent - b.changePercent);
      } catch (error) {
        logger.warn('Failed to get real losers data, returning mock data', { error: (error as Error).message });
        return this.getMockLosers();
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
        const quotes = await yahooFinance.quote(activeSymbols);

        // Handle both array and object responses
        let quotesObj: Record<string, any> = {};
        if (Array.isArray(quotes)) {
          quotes.forEach((quote: any) => {
            if (quote && quote.symbol) {
              quotesObj[quote.symbol] = quote;
            }
          });
        } else {
          quotesObj = quotes as Record<string, any>;
        }

        const stocks: Stock[] = [];
        for (const symbol of activeSymbols) {
          const quote = quotesObj?.[symbol];
          if (quote) {
            stocks.push(this.transformToStock({ ...quote, symbol }));
          }
        }

        // If no real data, return mock data
        if (stocks.length === 0) {
          logger.warn('No real stock data available for active stocks, returning mock data');
          return this.getMockActive();
        }

        // Sort by volume descending
        return stocks
          .sort((a, b) => b.volume - a.volume);
      } catch (error) {
        logger.warn('Failed to get most active stocks, returning mock data', { error: (error as Error).message });
        return this.getMockActive();
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
          .slice(0, 5); // Limit to 10 items

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