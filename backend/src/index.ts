/**
 * Stock Data Proxy Backend Server
 * Main application entry point with modular architecture
 */

import express from 'express';
import { logger } from './utils/logger.js';
import { getConfig } from './config/environment.js';
import { apiRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { corsMiddleware, securityHeaders, rateLimit } from './middleware/security.js';

const app = express();
const config = getConfig();

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(corsMiddleware);
app.use(securityHeaders);

// Rate limiting (100 requests per minute per IP)
app.use(rateLimit(60000, 100));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// API routes
app.use('/', apiRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Server instance for graceful shutdown
let server: any;

// Graceful startup
const startServer = async (): Promise<void> => {
  try {
    server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running at http://localhost:${config.port}`);
      logger.info(`📊 Available endpoints:`);
      logger.info(`   GET /health - Health check`);
      logger.info(`   GET /indexes - Market indexes`);
      logger.info(`   GET /gainers - Top gaining stocks`);
      logger.info(`   GET /losers - Top losing stocks`);
      logger.info(`   GET /active - Most active stocks`);
      logger.info(`   GET /spotlight?symbol=MSFT - Spotlight stock`);
      logger.info(`   GET /news?q=tech - Latest financial news`);
      logger.info(`🔧 Environment: ${config.nodeEnv}`);
    });

    server.on('error', (error: Error) => {
      logger.error('Server startup error', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = (signal: string): void => {
  logger.info(`📴 Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close((error?: Error) => {
      if (error) {
        logger.error('Error during server shutdown', error);
        process.exit(1);
      }
      
      logger.info('✅ Server closed successfully');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection', { reason, promise });
  gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();