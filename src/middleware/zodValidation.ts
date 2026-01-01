// src/middleware/zodValidation.ts

import { Request, Response, NextFunction } from 'express';
import { z, ZodType, ZodError } from 'zod';

// Generic validation middleware factory
export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and replace with parsed data
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      
      // Unknown error
      return next(new Error('Internal server error during validation'));
    }
  };
};

// Validate request body
export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      next(error);
    }
  };
};

// Validate query parameters
export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
        return next(result.error);
    }
    next();
  };
};

// Validate URL parameters
export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    
    if (!result.success) {
      return next(result.error);
    }
    
    // Type assertion needed for params
    req.params = result.data as any;
    next();
  };
};