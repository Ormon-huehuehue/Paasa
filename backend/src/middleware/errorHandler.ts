/**
 * Global Error Handler Middleware
 * Handles all unhandled errors and provides consistent error responses
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/api.js';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Unhandled error', {
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    statusCode: error.statusCode,
    code: error.code
  }, error);

  // Determine status code
  const statusCode = error.statusCode || 500;
  
  // Determine error code
  let errorCode = error.code || 'INTERNAL_SERVER_ERROR';
  
  // Map common HTTP status codes to error codes
  if (!error.code) {
    switch (statusCode) {
      case 400:
        errorCode = 'BAD_REQUEST';
        break;
      case 401:
        errorCode = 'UNAUTHORIZED';
        break;
      case 403:
        errorCode = 'FORBIDDEN';
        break;
      case 404:
        errorCode = 'NOT_FOUND';
        break;
      case 429:
        errorCode = 'RATE_LIMIT_EXCEEDED';
        break;
      case 502:
        errorCode = 'EXTERNAL_API_ERROR';
        break;
      case 503:
        errorCode = 'SERVICE_UNAVAILABLE';
        break;
      default:
        errorCode = 'INTERNAL_SERVER_ERROR';
    }
  }

  // Create error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: error.message || 'An unexpected error occurred',
      // Only include details in development mode
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    },
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    },
    timestamp: new Date().toISOString()
  };

  res.status(404).json(errorResponse);
};