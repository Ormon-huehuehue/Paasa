/**
 * Simple environment configuration
 */

import { AppConfig } from '../types/config.js';

/**
 * Load configuration from environment variables with defaults
 */
export function getConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    yahooApiTimeout: parseInt(process.env.YAHOO_API_TIMEOUT || '10000', 10),
    yahooApiRetryAttempts: parseInt(process.env.YAHOO_API_RETRY_ATTEMPTS || '3', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}