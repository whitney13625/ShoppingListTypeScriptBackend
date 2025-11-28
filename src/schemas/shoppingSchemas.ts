// src/schemas/shoppingSchemas.ts

import { z } from 'zod';

// Allowed categories enum
export const CategoryEnum = z.enum([
  'Fruits',
  'Vegetables',
  'Meat',
  'Dairy',
  'Bakery',
  'Snacks',
  'Beverages',
  'Other'
]);

// Shopping item schema (full item)
export const ShoppingItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  category: CategoryEnum.optional(),
  purchased: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating new item (no id, dates, or purchased status)
export const CreateShoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  category: CategoryEnum.optional(),
});

// Schema for updating item (all fields optional)
export const UpdateShoppingItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  quantity: z.number().int().nonnegative().optional(),
  category: CategoryEnum.optional(),
  purchased: z.boolean().optional(),
});

// Schema for query parameters (GET /api/shopping)
export const GetAllItemsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  category: CategoryEnum.optional(),
  purchased: z.enum(['true', 'false']).optional(),
  search: z.string().min(1).max(100).optional(),
});

// Schema for URL parameters with ID
export const ItemIdParamsSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

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

// Infer TypeScript types from schemas
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;
export type CreateShoppingItemDto = z.infer<typeof CreateShoppingItemSchema>;
export type UpdateShoppingItemDto = z.infer<typeof UpdateShoppingItemSchema>;
export type GetAllItemsQuery = z.infer<typeof GetAllItemsQuerySchema>;
export type ItemIdParams = z.infer<typeof ItemIdParamsSchema>;