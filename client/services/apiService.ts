import { apiClient, FEATURE_FLAGS } from '../config/api';
import {
  ApiServiceInterface,
  StockListResponse,
  SpotlightStockResponse,
  NewsResponse,
  MarketIndexResponse,
  StockListParams,
  NewsParams,
  SpotlightParams,
  Stock,
  SpotlightStock,
  NewsItem
} from '../types/api';

/**
 * API Service class that handles all communication with the backend API
 * Implements data transformation and error handling for all endpoints
 */
class ApiService implements ApiServiceInterface {
  
  /**
   * Get top gaining stocks from the backend
   * @param params - Optional parameters for limit and offset
   * @returns Promise<StockListResponse>
   */
  async getTopGainers(params?: StockListParams): Promise<StockListResponse> {
    try {
      console.log('[ApiService] Fetching top gainers with params:', params);
      const response = await apiClient.get('/gainers', { params });
      console.log('[ApiService] Top gainers response:', response.data);
      return this.transformStockListResponse(response.data, 'Top Gainers');
    } catch (error) {
      console.error('[ApiService] Error fetching top gainers:', error);
      throw error;
    }
  }

  /**
   * Get top losing stocks from the backend
   * @param params - Optional parameters for limit and offset
   * @returns Promise<StockListResponse>
   */
  async getTopLosers(params?: StockListParams): Promise<StockListResponse> {
    try {
      console.log('[ApiService] Fetching top losers with params:', params);
      const response = await apiClient.get('/losers', { params });
      console.log('[ApiService] Top losers response:', response.data);
      return this.transformStockListResponse(response.data, 'Top Losers');
    } catch (error) {
      console.error('[ApiService] Error fetching top losers:', error);
      throw error;
    }
  }

  /**
   * Get most active stocks from the backend
   * @param params - Optional parameters for limit and offset
   * @returns Promise<StockListResponse>
   */
  async getMostActive(params?: StockListParams): Promise<StockListResponse> {
    try {
      console.log('[ApiService] Fetching most active with params:', params);
      const response = await apiClient.get('/active', { params });
      console.log('[ApiService] Most active response:', response.data);
      return this.transformStockListResponse(response.data, 'Most Active');
    } catch (error) {
      console.error('[ApiService] Error fetching most active:', error);
      throw error;
    }
  }

  /**
   * Get spotlight stock information with random selection if no symbol provided
   * @param params - Optional parameters with symbol
   * @returns Promise<SpotlightStockResponse>
   */
  async getSpotlightStock(params?: SpotlightParams): Promise<SpotlightStockResponse> {
    try {
      // If no symbol provided, randomly select from predefined list
      const symbol = params?.symbol || this.getRandomSpotlightSymbol();
      
      const response = await apiClient.get(`/spotlight?${symbol}`);
      return this.transformSpotlightResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get latest news with optional query and pagination
   * @param params - Optional parameters for query, limit, and offset
   * @returns Promise<NewsResponse>
   */
  async getLatestNews(params?: NewsParams): Promise<NewsResponse> {
    try {
      const response = await apiClient.get('/news', { params });
      return this.transformNewsResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get market indexes data
   * @returns Promise<MarketIndexResponse>
   */
  async getMarketIndexes(): Promise<MarketIndexResponse> {
    try {
      console.log('[ApiService] Fetching market indexes...');
      const response = await apiClient.get('/indexes');
      console.log('[ApiService] Market indexes response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ApiService] Error fetching market indexes:', error);
      throw error;
    }
  }

  /**
   * Transform backend stock list response to client format
   * @param backendResponse - Raw response from backend
   * @param title - Title for the stock list
   * @returns Transformed StockListResponse
   */
  private transformStockListResponse(backendResponse: any, title: string): StockListResponse {
    console.log('[ApiService] Transforming response:', backendResponse);
    
    // Handle the actual backend response structure based on API docs
    // Backend returns: { success: true, data: { stocks: [...], pagination: {...} }, timestamp: "..." }
    let stocks = [];
    let pagination = {
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false
    };

    if (backendResponse.success && backendResponse.data) {
      if (backendResponse.data.stocks) {
        // New API structure with nested data
        stocks = backendResponse.data.stocks.map((stock: any) => this.transformStock(stock));
        pagination = backendResponse.data.pagination || pagination;
      } else if (Array.isArray(backendResponse.data)) {
        // Fallback: if data is directly an array of stocks
        stocks = backendResponse.data.map((stock: any) => this.transformStock(stock));
        pagination = {
          total: stocks.length,
          limit: stocks.length,
          offset: 0,
          hasMore: false
        };
      }
    }
    
    console.log('[ApiService] Transformed stocks:', stocks);
    console.log('[ApiService] Pagination:', pagination);
    
    return {
      success: backendResponse.success || true,
      data: {
        title,
        stocks,
        pagination
      },
      timestamp: backendResponse.timestamp || new Date().toISOString()
    };
  }

  /**
   * Transform backend spotlight response to client format
   * @param backendResponse - Raw response from backend
   * @returns Transformed SpotlightStockResponse
   */
  private transformSpotlightResponse(backendResponse: any): SpotlightStockResponse {
    const transformedStock = this.transformSpotlightStock(backendResponse.data);
    
    return {
      success: backendResponse.success || true,
      data: transformedStock,
      timestamp: backendResponse.timestamp || new Date().toISOString()
    };
  }

  /**
   * Transform backend news response to client format
   * @param backendResponse - Raw response from backend
   * @returns Transformed NewsResponse
   */
  private transformNewsResponse(backendResponse: any): NewsResponse {
    const transformedNews = backendResponse.data?.map((newsItem: any) => this.transformNewsItem(newsItem)) || [];
    
    return {
      success: backendResponse.success || true,
      data: transformedNews,
      timestamp: backendResponse.timestamp || new Date().toISOString(),
      pagination: backendResponse.pagination
    };
  }

  /**
   * Transform individual stock data from backend format to client format
   * @param backendStock - Raw stock data from backend
   * @returns Transformed Stock object
   */
  private transformStock(backendStock: any): Stock {
    return {
      symbol: backendStock.symbol || '',
      name: backendStock.name || backendStock.shortName || '',
      price: this.parseNumber(backendStock.price || backendStock.regularMarketPrice),
      change: this.parseNumber(backendStock.change || backendStock.regularMarketChange),
      changePercent: this.parseNumber(backendStock.changePercent || backendStock.regularMarketChangePercent),
      volume: this.parseNumber(backendStock.volume || backendStock.regularMarketVolume)
    };
  }

  /**
   * Transform individual spotlight stock data from backend format to client format
   * @param backendStock - Raw spotlight stock data from backend
   * @returns Transformed SpotlightStock object
   */
  private transformSpotlightStock(backendStock: any): SpotlightStock {
    const baseStock = this.transformStock(backendStock);
    
    return {
      ...baseStock,
      description: backendStock.description || backendStock.longBusinessSummary || 'No description available',
      marketCap: this.parseNumber(backendStock.marketCap),
      peRatio: backendStock.peRatio ? this.parseNumber(backendStock.peRatio) : undefined,
      sector: backendStock.sector || undefined,
      industry: backendStock.industry || undefined
    };
  }

  /**
   * Transform individual news item from backend format to client format
   * @param backendNews - Raw news data from backend
   * @returns Transformed NewsItem object
   */
  private transformNewsItem(backendNews: any): NewsItem {
    return {
      title: backendNews.title || '',
      summary: backendNews.summary || backendNews.description || '',
      url: backendNews.url || backendNews.link || '',
      publishedAt: new Date(backendNews.publishedAt || backendNews.pubDate || Date.now()),
      source: backendNews.source || backendNews.publisher || 'Unknown',
      uuid: backendNews.uuid || backendNews.id
    };
  }

  /**
   * Safely parse number values from backend response
   * @param value - Value to parse as number
   * @returns Parsed number or 0 if invalid
   */
  private parseNumber(value: any): number {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return 0;
  }

  /**
   * Get a random symbol from the predefined spotlight stocks list
   * @returns Random stock symbol
   */
  private getRandomSpotlightSymbol(): string {
    const symbols = FEATURE_FLAGS.SPOTLIGHT_STOCKS;
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing purposes
export { ApiService };

// Export utility functions for data transformation
export const transformStock = (backendStock: any): Stock => {
  const service = new ApiService();
  return (service as any).transformStock(backendStock);
};

export const transformSpotlightStock = (backendStock: any): SpotlightStock => {
  const service = new ApiService();
  return (service as any).transformSpotlightStock(backendStock);
};

export const transformNewsItem = (backendNews: any): NewsItem => {
  const service = new ApiService();
  return (service as any).transformNewsItem(backendNews);
};