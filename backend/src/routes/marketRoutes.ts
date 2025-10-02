/**
 * Market Data Routes
 * Defines all market-related API endpoints
 */

import { Router } from 'express';
import { marketController } from '../controllers/marketController.js';
import { validateStockSymbol } from '../middleware/validation.js';

const router = Router();

/**
 * GET /indexes
 * Fetches major market indexes (S&P 500, NASDAQ 100, etc.)
 */
router.get('/indexes', (req, res) => marketController.getMarketIndexes(req, res));

/**
 * GET /gainers
 * Fetches top gaining stocks
 */
router.get('/gainers', (req, res) => marketController.getTopGainers(req, res));

/**
 * GET /losers
 * Fetches top losing stocks
 */
router.get('/losers', (req, res) => marketController.getTopLosers(req, res));

/**
 * GET /active
 * Fetches most actively traded stocks
 */
router.get('/active', (req, res) => marketController.getMostActive(req, res));

/**
 * GET /spotlight
 * Fetches detailed information for a featured stock
 * Query params: symbol (optional, defaults to AAPL)
 */
router.get('/spotlight', validateStockSymbol, (req, res) => marketController.getSpotlightStock(req, res));

export { router as marketRoutes };