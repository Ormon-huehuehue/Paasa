/**
 * Simple logging utility
 */

/**
 * Simple logger class
 */
class SimpleLogger {
  private logLevel: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, message: string, context?: any, error?: Error): string {
    const timestamp = new Date().toISOString();
    let output = `[${timestamp}] ${level.toUpperCase()} ${message}`;
    
    if (context) {
      output += ` ${JSON.stringify(context)}`;
    }
    
    if (error) {
      output += `\nError: ${error.message}`;
      if (error.stack) {
        output += `\n${error.stack}`;
      }
    }
    
    return output;
  }

  error(message: string, context?: any, error?: Error): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context, error));
    }
  }

  warn(message: string, context?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  info(message: string, context?: any): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  debug(message: string, context?: any): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  logApiCall(service: string, endpoint: string, duration?: number, error?: Error): void {
    const context = { service, endpoint, duration: duration ? `${duration}ms` : undefined };
    if (error) {
      this.error(`API call failed: ${service}`, context, error);
    } else {
      this.debug(`API call: ${service}`, context);
    }
  }
}

export const logger = new SimpleLogger();