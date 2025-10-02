/**
 * Market Data Routes
 * Defines all market-related API endpoints
 */

import { Router } from 'express';
import { marketController } from '../controllers/marketController.js';
import { validateStockSymbolWithPagination, validatePagination } from '../middleware/validation.js';

const router = Router();

/**
 * GET /indexes
 * Fetches major market indexes (S&P 500, NASDAQ 100, etc.)
 */
router.get('/indexes', (req, res) => marketController.getMarketIndexes(req, res));

/**
 * GET /gainers
 * Fetches top gaining stocks with pagination
 * Query params: limit (optional, default 10, max 50), offset (optional, default 0)
 */
router.get('/gainers', validatePagination, (req, res) => marketController.getTopGainers(req, res));

/**
 * GET /losers
 * Fetches top losing stocks with pagination
 * Query params: limit (optional, default 10, max 50), offset (optional, default 0)
 */
router.get('/losers', validatePagination, (req, res) => marketController.getTopLosers(req, res));

/**
 * GET /active
 * Fetches most actively traded stocks with pagination
 * Query params: limit (optional, default 10, max 50), offset (optional, default 0)
 */
router.get('/active', validatePagination, (req, res) => marketController.getMostActive(req, res));

/**
 * GET /spotlight
 * Fetches detailed information for a featured stock
 * Query params: symbol (optional, defaults to AAPL)
 */
router.get('/spotlight', validateStockSymbolWithPagination, (req, res) => marketController.getSpotlightStock(req, res));

export { router as marketRoutes };