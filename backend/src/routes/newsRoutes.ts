/**
 * News Routes
 * Defines all news-related API endpoints
 */

import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';
import { validateNewsQuery } from '../middleware/validation.js';

const router = Router();

/**
 * GET /news
 * Fetches latest financial news
 * Query params: q (optional, defaults to 'US stocks')
 */
router.get('/news', validateNewsQuery, (req, res) => newsController.getLatestNews(req, res));

export { router as newsRoutes };