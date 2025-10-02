/**
 * News Routes
 * Defines all news-related API endpoints
 */

import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';
import { validateNewsQueryWithPagination } from '../middleware/validation.js';

const router = Router();

/**
 * GET /news
 * Fetches latest financial news with pagination
 * Query params: q (optional, defaults to 'US stocks'), limit (optional, default 10, max 50), offset (optional, default 0)
 */
router.get('/news', validateNewsQueryWithPagination, (req, res) => newsController.getLatestNews(req, res));

export { router as newsRoutes };