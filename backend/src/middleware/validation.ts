/**
 * Input Validation Middleware
 * Validates request parameters and query strings
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/api.js';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowedValues?: string[];
}

/**
 * Creates a validation middleware for query parameters
 */
export const validateQuery = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.query[rule.field];

      // Check if required field is missing
      if (rule.required && (value === undefined || value === '')) {
        errors.push(`Query parameter '${rule.field}' is required`);
        continue;
      }

      // Skip validation if field is not provided and not required
      if (value === undefined || value === '') {
        continue;
      }

      const stringValue = String(value);

      // Type validation
      if (rule.type === 'number' && isNaN(Number(stringValue))) {
        errors.push(`Query parameter '${rule.field}' must be a number`);
        continue;
      }

      if (rule.type === 'boolean' && !['true', 'false', '1', '0'].includes(stringValue.toLowerCase())) {
        errors.push(`Query parameter '${rule.field}' must be a boolean`);
        continue;
      }

      // Length validation
      if (rule.minLength && stringValue.length < rule.minLength) {
        errors.push(`Query parameter '${rule.field}' must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && stringValue.length > rule.maxLength) {
        errors.push(`Query parameter '${rule.field}' must be no more than ${rule.maxLength} characters`);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(stringValue)) {
        errors.push(`Query parameter '${rule.field}' has invalid format`);
      }

      // Allowed values validation
      if (rule.allowedValues && !rule.allowedValues.includes(stringValue)) {
        errors.push(`Query parameter '${rule.field}' must be one of: ${rule.allowedValues.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request parameters',
          details: errors
        },
        timestamp: new Date().toISOString()
      };

      res.status(400).json(errorResponse);
      return;
    }

    next();
  };
};

/**
 * Validation rules for stock symbol
 */
export const validateStockSymbol = validateQuery([
  {
    field: 'symbol',
    required: false,
    type: 'string',
    minLength: 1,
    maxLength: 10,
    pattern: /^[A-Z0-9.-]+$/i
  }
]);

/**
 * Validation rules for news query
 */
export const validateNewsQuery = validateQuery([
  {
    field: 'q',
    required: false,
    type: 'string',
    minLength: 1,
    maxLength: 100
  }
]);