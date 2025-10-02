/**
 * Structured logging utility with configurable log levels
 */

import { getConfig } from '../config/environment.js';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

/**
 * Log level mapping from string to enum
 */
const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  debug: LogLevel.DEBUG,
  trace: LogLevel.TRACE,
};

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  correlationId?: string;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  level: LogLevel;
  enableColors: boolean;
  enableTimestamp: boolean;
}

/**
 * ANSI color codes for console output
 */
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
} as const;

/**
 * Color mapping for log levels
 */
const LEVEL_COLORS = {
  [LogLevel.ERROR]: COLORS.red,
  [LogLevel.WARN]: COLORS.yellow,
  [LogLevel.INFO]: COLORS.blue,
  [LogLevel.DEBUG]: COLORS.green,
  [LogLevel.TRACE]: COLORS.gray,
} as const;

/**
 * Logger class with structured logging capabilities
 */
class Logger {
  private config: LoggerConfig;
  private correlationId?: string;

  constructor(config?: Partial<LoggerConfig>) {
    const appConfig = getConfig();
    const logLevel = LOG_LEVEL_MAP[appConfig.logLevel] ?? LogLevel.INFO;
    
    this.config = {
      level: logLevel,
      enableColors: process.stdout.isTTY && appConfig.nodeEnv !== 'production',
      enableTimestamp: true,
      ...config,
    };
  }

  /**
   * Set correlation ID for request tracking
   */
  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  /**
   * Clear correlation ID
   */
  clearCorrelationId(): void {
    delete this.correlationId;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.config);
    if (this.correlationId) {
      childLogger.correlationId = this.correlationId;
    }
    return childLogger;
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, error, correlationId } = entry;
    
    if (this.config.enableColors) {
      const levelEnum = LOG_LEVEL_MAP[level];
      const color = levelEnum !== undefined ? LEVEL_COLORS[levelEnum] : COLORS.reset;
      const resetColor = COLORS.reset;
      
      let formatted = `${COLORS.gray}${timestamp}${resetColor} ${color}[${level.toUpperCase()}]${resetColor} ${message}`;
      
      if (correlationId) {
        formatted += ` ${COLORS.gray}(${correlationId})${resetColor}`;
      }
      
      if (context && Object.keys(context).length > 0) {
        formatted += `\n${COLORS.gray}Context: ${JSON.stringify(context, null, 2)}${resetColor}`;
      }
      
      if (error) {
        formatted += `\n${COLORS.red}Error: ${error.name}: ${error.message}${resetColor}`;
        if (error.stack) {
          formatted += `\n${COLORS.gray}${error.stack}${resetColor}`;
        }
      }
      
      return formatted;
    } else {
      // JSON format for production/structured logging
      return JSON.stringify(entry);
    }
  }

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel, 
    message: string, 
    context?: Record<string, any>, 
    error?: Error
  ): LogEntry {
    const levelName = Object.keys(LOG_LEVEL_MAP).find(key => LOG_LEVEL_MAP[key] === level) || 'unknown';
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      message,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        ...(error.stack && { stack: error.stack }),
      };
    }

    if (this.correlationId) {
      entry.correlationId = this.correlationId;
    }

    return entry;
  }

  /**
   * Log at specified level
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, context, error);
    const formatted = this.formatLogEntry(entry);

    // Output to appropriate stream
    if (level <= LogLevel.WARN) {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log trace message
   */
  trace(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, context);
  }

  /**
   * Log HTTP request
   */
  logRequest(method: string, url: string, statusCode?: number, duration?: number): void {
    const context: Record<string, any> = {
      method,
      url,
    };

    if (statusCode !== undefined) {
      context.statusCode = statusCode;
    }

    if (duration !== undefined) {
      context.duration = `${duration}ms`;
    }

    const level = statusCode && statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, `HTTP ${method} ${url}`, context);
  }

  /**
   * Log external API call
   */
  logApiCall(service: string, endpoint: string, duration?: number, error?: Error): void {
    const context: Record<string, any> = {
      service,
      endpoint,
    };

    if (duration !== undefined) {
      context.duration = `${duration}ms`;
    }

    if (error) {
      this.error(`External API call failed: ${service} ${endpoint}`, context, error);
    } else {
      this.info(`External API call: ${service} ${endpoint}`, context);
    }
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a new logger instance with custom configuration
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

/**
 * Generate correlation ID for request tracking
 */
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}