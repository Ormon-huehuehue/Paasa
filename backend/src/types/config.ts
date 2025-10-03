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
  

  
  // Logging
  logLevel: string;
}

