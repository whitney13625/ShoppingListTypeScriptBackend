// src/schemas/shoppingSchemas.ts

import { z } from 'zod';

// Allowed categories enum
// USAGE: catgory: CategoryEnum.optional()
/*
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
*/

// Category schema
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Shopping item schema (full item)
export const ShoppingItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  categoryId: z.string().uuid().optional().nullable(),
  purchased: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Shopping item with category details (for responses)
export const ShoppingItemWithCategorySchema = ShoppingItemSchema.extend({
  category: CategorySchema.optional().nullable(),
});

// Schema for creating new item (no id, dates, or purchased status)
export const CreateShoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
});

// Schema for updating item (all fields optional)
export const UpdateShoppingItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  quantity: z.number().int().nonnegative().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  purchased: z.boolean().optional(),
});

// Schema for query parameters (GET /api/shopping)
export const GetAllItemsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
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
export type Category = z.infer<typeof CategorySchema>;
export type ShoppingItemWithCategory = z.infer<typeof ShoppingItemWithCategorySchema>;
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;
export type CreateShoppingItemDto = z.infer<typeof CreateShoppingItemSchema>;
export type UpdateShoppingItemDto = z.infer<typeof UpdateShoppingItemSchema>;
export type GetAllItemsQuery = z.infer<typeof GetAllItemsQuerySchema>;
export type ItemIdParams = z.infer<typeof ItemIdParamsSchema>;