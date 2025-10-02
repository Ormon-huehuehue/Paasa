/**
 * News Controller
 * Handles all news-related API endpoints
 */

import { Request, Response } from 'express';
import { yahooFinanceService } from '../services/yahooFinanceService.js';
import { ApiResponse, ErrorResponse, PaginatedResponse } from '../types/api.js';
import { NewsItem } from '../types/market.js';
import { logger } from '../utils/logger.js';
import { parsePaginationParams, paginateArray } from '../utils/pagination.js';

export class NewsController {
  /**
   * Get latest financial news with pagination
   */
  async getLatestNews(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string || 'US stocks'; // Default query
      const { limit, offset } = parsePaginationParams(req.query);
      
      const allNews = await yahooFinanceService.getLatestNews(query);
      const paginatedResult = paginateArray(allNews, limit, offset);
      
      const response: PaginatedResponse<NewsItem> = {
        success: true,
        data: paginatedResult.items,
        pagination: paginatedResult.pagination,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch latest news', { 
        url: req.url, 
        method: req.method, 
        query: req.query.q 
      }, error as Error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'LATEST_NEWS_ERROR',
          message: 'Failed to fetch latest financial news',
          details: (error as Error).message
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorResponse);
    }
  }
}

// Export singleton instance
export const newsController = new NewsController();