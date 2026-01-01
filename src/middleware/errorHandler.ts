// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: JSON.parse(err.message),
    });
  }

  // Log unexpected errors for debugging
  console.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
