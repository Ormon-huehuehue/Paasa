/**
 * Configuration type definitions
 */

export interface AppConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  
  // API Configuration
  yahooApiTimeout: number;
  yahooApiRetryAttempts: number;
  
  // Cache Configuration (Optional)
  redis?: {
    url: string;
    password?: string;
  };
  cacheTtlMarket: number;
  cacheTtlNews: number;
  
  // Logging
  logLevel: string;
}

export interface DatabaseConfig {
  redis?: {
    url: string;
    password?: string;
    connectTimeout?: number;
    lazyConnect?: boolean;
  };
}

export interface CacheConfig {
  ttl: {
    market: number;
    news: number;
  };
  keyPrefix: string;
}