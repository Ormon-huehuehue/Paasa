/**
 * Market Data Controller
 * Handles all market-related API endpoints
 */

import { Request, Response } from 'express';
import { yahooFinanceService } from '../services/yahooFinanceService.js';
import { ApiResponse, ErrorResponse } from '../types/api.js';
import { MarketIndex, Stock, SpotlightStock } from '../types/market.js';
import { logger } from '../utils/logger.js';

export class MarketController {
  /**
   * Get market indexes (S&P 500, NASDAQ 100, etc.)
   */
  async getMarketIndexes(req: Request, res: Response): Promise<void> {
    try {
      const indexes = await yahooFinanceService.getMarketIndexes();
      
      const response: ApiResponse<MarketIndex[]> = {
        success: true,
        data: indexes,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch market indexes', { url: req.url, method: req.method }, error as Error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'MARKET_INDEXES_ERROR',
          message: 'Failed to fetch market indexes',
          details: (error as Error).message
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Get top gaining stocks
   */
  async getTopGainers(req: Request, res: Response): Promise<void> {
    try {
      const stocks = await yahooFinanceService.getTopGainers();
      
      const response: ApiResponse<{ title: string; stocks: Stock[] }> = {
        success: true,
        data: {
          title: 'Top Gainers',
          stocks
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch top gainers', { url: req.url, method: req.method }, error as Error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'TOP_GAINERS_ERROR',
          message: 'Failed to fetch top gaining stocks',
          details: (error as Error).message
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Get top losing stocks
   */
  async getTopLosers(req: Request, res: Response): Promise<void> {
    try {
      const stocks = await yahooFinanceService.getTopLosers();
      
      const response: ApiResponse<{ title: string; stocks: Stock[] }> = {
        success: true,
        data: {
          title: 'Top Losers',
          stocks
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch top losers', { url: req.url, method: req.method }, error as Error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'TOP_LOSERS_ERROR',
          message: 'Failed to fetch top losing stocks',
          details: (error as Error).message
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Get most actively traded stocks
   */
  async getMostActive(req: Request, res: Response): Promise<void> {
    try {
      const stocks = await yahooFinanceService.getMostActive();
      
      const response: ApiResponse<{ title: string; stocks: Stock[] }> = {
        success: true,
        data: {
          title: 'Most Active',
          stocks
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch most active stocks', { url: req.url, method: req.method }, error as Error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'MOST_ACTIVE_ERROR',
          message: 'Failed to fetch most active stocks',
          details: (error as Error).message
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Get spotlight stock with detailed information
   */
  async getSpotlightStock(req: Request, res: Response): Promise<void> {
    try {
      const symbol = req.query.symbol as string || 'AAPL'; // Default to Apple
      const spotlightStock = await yahooFinanceService.getSpotlightStock(symbol);
      
      const response: ApiResponse<SpotlightStock> = {
        success: true,
        data: spotlightStock,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Failed to fetch spotlight stock', { 
        url: req.url, 
        method: req.method, 
        symbol: req.query.symbol 
      }, error as Error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'SPOTLIGHT_STOCK_ERROR',
          message: 'Failed to fetch spotlight stock information',
          details: (error as Error).message
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorResponse);
    }
  }
}

// Export singleton instance
export const marketController = new MarketController();