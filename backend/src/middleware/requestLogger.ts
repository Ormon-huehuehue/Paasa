/**
 * Request Logger Middleware
 * Logs incoming HTTP requests for debugging and monitoring
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface RequestLogData {
  method: string;
  url: string;
  userAgent?: string;
  ip: string;
  responseTime?: number;
  statusCode?: number;
  contentLength?: number;
}

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Log incoming request
  const requestData = {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress || 'unknown'
  };

  logger.info('Incoming request', requestData);

  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const responseTime = Date.now() - startTime;
    
    // Log response
    const responseData = {
      method: requestData.method,
      url: requestData.url,
      userAgent: requestData.userAgent,
      ip: requestData.ip,
      responseTime,
      statusCode: res.statusCode,
      contentLength: res.get('Content-Length') ? parseInt(res.get('Content-Length')!) : undefined
    };

    // Log based on status code
    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', responseData);
    } else {
      logger.info('Request completed', responseData);
    }

    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};