
import '../lib/zodSetup';
import { z } from 'zod';

// API Response schemas
export const ApiSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.unknown(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});