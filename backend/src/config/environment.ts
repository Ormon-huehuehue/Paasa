/**
 * Environment configuration module with validation and defaults
 */

import { AppConfig } from '../types/config.js';

/**
 * Environment variable names
 */
const ENV_VARS = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  YAHOO_API_TIMEOUT: 'YAHOO_API_TIMEOUT',
  YAHOO_API_RETRY_ATTEMPTS: 'YAHOO_API_RETRY_ATTEMPTS',
  REDIS_URL: 'REDIS_URL',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
  CACHE_TTL_MARKET: 'CACHE_TTL_MARKET',
  CACHE_TTL_NEWS: 'CACHE_TTL_NEWS',
  LOG_LEVEL: 'LOG_LEVEL',
} as const;

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Partial<AppConfig> = {
  port: 3000,
  nodeEnv: 'development',
  yahooApiTimeout: 10000,
  yahooApiRetryAttempts: 3,
  cacheTtlMarket: 60,
  cacheTtlNews: 300,
  logLevel: 'info',
};

/**
 * Valid log levels
 */
const VALID_LOG_LEVELS = ['error', 'warn', 'info', 'debug', 'trace'] as const;

/**
 * Valid node environments
 */
const VALID_NODE_ENVS = ['development', 'production', 'test'] as const;

/**
 * Configuration validation error
 */
export class ConfigValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Parse integer from environment variable with validation
 */
function parseInteger(value: string | undefined, fieldName: string, min?: number, max?: number): number | undefined {
  if (!value) return undefined;
  
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new ConfigValidationError(`${fieldName} must be a valid integer, got: ${value}`, fieldName);
  }
  
  if (min !== undefined && parsed < min) {
    throw new ConfigValidationError(`${fieldName} must be at least ${min}, got: ${parsed}`, fieldName);
  }
  
  if (max !== undefined && parsed > max) {
    throw new ConfigValidationError(`${fieldName} must be at most ${max}, got: ${parsed}`, fieldName);
  }
  
  return parsed;
}

/**
 * Validate log level
 */
function validateLogLevel(level: string): string {
  if (!VALID_LOG_LEVELS.includes(level as any)) {
    throw new ConfigValidationError(
      `LOG_LEVEL must be one of: ${VALID_LOG_LEVELS.join(', ')}, got: ${level}`,
      'LOG_LEVEL'
    );
  }
  return level;
}

/**
 * Validate node environment
 */
function validateNodeEnv(env: string): string {
  if (!VALID_NODE_ENVS.includes(env as any)) {
    throw new ConfigValidationError(
      `NODE_ENV must be one of: ${VALID_NODE_ENVS.join(', ')}, got: ${env}`,
      'NODE_ENV'
    );
  }
  return env;
}

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): AppConfig {
  try {
    // Parse and validate individual configuration values
    const port = parseInteger(process.env[ENV_VARS.PORT], 'PORT', 1, 65535) ?? DEFAULT_CONFIG.port!;
    const nodeEnv = validateNodeEnv(process.env[ENV_VARS.NODE_ENV] ?? DEFAULT_CONFIG.nodeEnv!);
    
    const yahooApiTimeout = parseInteger(
      process.env[ENV_VARS.YAHOO_API_TIMEOUT], 
      'YAHOO_API_TIMEOUT', 
      1000, 
      60000
    ) ?? DEFAULT_CONFIG.yahooApiTimeout!;
    
    const yahooApiRetryAttempts = parseInteger(
      process.env[ENV_VARS.YAHOO_API_RETRY_ATTEMPTS], 
      'YAHOO_API_RETRY_ATTEMPTS', 
      0, 
      10
    ) ?? DEFAULT_CONFIG.yahooApiRetryAttempts!;
    
    const cacheTtlMarket = parseInteger(
      process.env[ENV_VARS.CACHE_TTL_MARKET], 
      'CACHE_TTL_MARKET', 
      1, 
      3600
    ) ?? DEFAULT_CONFIG.cacheTtlMarket!;
    
    const cacheTtlNews = parseInteger(
      process.env[ENV_VARS.CACHE_TTL_NEWS], 
      'CACHE_TTL_NEWS', 
      1, 
      3600
    ) ?? DEFAULT_CONFIG.cacheTtlNews!;
    
    const logLevel = validateLogLevel(process.env[ENV_VARS.LOG_LEVEL] ?? DEFAULT_CONFIG.logLevel!);
    
    // Handle optional Redis configuration
    const redisUrl = process.env[ENV_VARS.REDIS_URL];
    const redisPassword = process.env[ENV_VARS.REDIS_PASSWORD];
    
    const redis = redisUrl ? {
      url: redisUrl,
      ...(redisPassword && { password: redisPassword }),
    } : undefined;
    
    const config: AppConfig = {
      port,
      nodeEnv,
      yahooApiTimeout,
      yahooApiRetryAttempts,
      cacheTtlMarket,
      cacheTtlNews,
      logLevel,
      ...(redis && { redis }),
    };
    
    return config;
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      throw error;
    }
    throw new ConfigValidationError(`Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get configuration with caching
 */
let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

/**
 * Reset cached configuration (useful for testing)
 */
export function resetConfig(): void {
  cachedConfig = null;
}

/**
 * Validate required environment variables for production
 */
export function validateProductionConfig(config: AppConfig): void {
  if (config.nodeEnv === 'production') {
    // Add any production-specific validation here
    if (config.logLevel === 'debug' || config.logLevel === 'trace') {
      console.warn('Warning: Debug logging enabled in production environment');
    }
  }
}