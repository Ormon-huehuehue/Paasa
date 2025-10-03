/**
 * Security Middleware
 * Implements CORS, security headers, and rate limiting
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/api.js';

/**
 * CORS middleware configuration
 */
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Allow requests from any origin in development, restrict in production
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'])
    : ['*'];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
};


/**
 * Simple rate limiting middleware
 * Uses in-memory storage for rate limiting
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export const rateLimit = (windowMs: number = 60000, maxRequests: number = 100) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    Object.keys(rateLimitStore).forEach(key => {
      const entry = rateLimitStore[key];
      if (entry && entry.resetTime < now) {
        delete rateLimitStore[key];
      }
    });

    // Initialize or get client data
    if (!rateLimitStore[clientId] || rateLimitStore[clientId].resetTime < now) {
      rateLimitStore[clientId] = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
      rateLimitStore[clientId].count++;
    }

    const clientData = rateLimitStore[clientId];
    
    // Set rate limit headers
    res.header('X-RateLimit-Limit', maxRequests.toString());
    res.header('X-RateLimit-Remaining', Math.max(0, maxRequests - clientData.count).toString());
    res.header('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000).toString());

    // Check if rate limit exceeded
    if (clientData.count > maxRequests) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later'
        },
        timestamp: new Date().toISOString()
      };

      res.status(429).json(errorResponse);
      return;
    }

    next();
  };
};