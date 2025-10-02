/**
 * Routes Index
 * Central route configuration and organization
 */

import { Router } from 'express';
import { marketRoutes } from './marketRoutes.js';
import { newsRoutes } from './newsRoutes.js';

const router = Router();

// Mount market data routes
router.use('/', marketRoutes);

// Mount news routes  
router.use('/', newsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    timestamp: new Date().toISOString()
  });
});

export { router as apiRoutes };