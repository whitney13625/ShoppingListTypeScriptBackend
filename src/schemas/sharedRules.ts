
import { z } from 'zod';

export const searchSchema = z.string().min(1).max(100).optional().openapi({ example: '10' });
export const uuidSchema = z.uuid('Invalid UUID format').openapi({ example: '550e8400-e29b-41d4-a716-446655440000' });
export const booleanSchema = z.enum(['true', 'false']).openapi({ example: 'true' });