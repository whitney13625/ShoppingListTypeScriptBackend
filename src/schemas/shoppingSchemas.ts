// src/schemas/shoppingSchemas.ts

import '../lib/zodSetup';
import { z } from 'zod';
import { CategorySchema } from '../schemas/categorySchemas';

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

// Shopping item schema (full item)
export const ShoppingItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').openapi({ example: 'Spinach' }),
  quantity: z.number().int().nonnegative('Quantity must be non-negative').openapi({ example: 'Vegitables' }),
  categoryId: z.string().uuid().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  purchased: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).openapi({ description: 'Shopping item object' });

// Shopping item with category details (for responses)
export const ShoppingItemWithCategorySchema = ShoppingItemSchema.extend({
  category: CategorySchema.optional().nullable(),
});

export const ShoppingItemListResponseSchema = z.array(ShoppingItemWithCategorySchema);

// Schema for creating new item (no id, dates, or purchased status)
export const CreateShoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').openapi({ example: 'Brussel Sprouts' }),
  quantity: z.number().int().nonnegative('Quantity must be non-negative').openapi({ example: 10 }),
  categoryName: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
})
.refine((data) => {
  // Logic: At least one of them must have a value (truthy)
  // If categoryName is null/undefined, categoryId must be present, and vice versa.
  return !!data.categoryName || !!data.categoryId;
}, {
  message: "Either categoryName or categoryId must be provided",
  path: ["categoryId"], // This attaches the error to the categoryId field in the response
})
.openapi({ description: 'Create Shopping item' });

// Schema for updating item (all fields optional)
export const UpdateShoppingItemSchema = z.object({
  name: z.string().min(1).max(100).optional().openapi({ example: 'Brussel Sprouts' }),
  quantity: z.number().int().nonnegative().optional().openapi({ example: 10 }),
  categoryName: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  purchased: z.boolean().optional().openapi({ example: true }),
}).openapi({ description: 'Update Shopping item' });

// Schema for query parameters (GET /api/shopping)
export const GetAllItemsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  purchased: z.enum(['true', 'false']).optional().openapi({ example: 'true' }),
  search: z.string().min(1).max(100).optional().openapi({ example: '10' }),
}).openapi({ description: 'Get all Shopping items' });

// Schema for URL parameters with ID
export const ItemIdParamsSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
}).openapi({ description: 'Unique ID' });

// Infer TypeScript types from schemas
export type ShoppingItemWithCategory = z.infer<typeof ShoppingItemWithCategorySchema>;
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;
export type CreateShoppingItemDto = z.infer<typeof CreateShoppingItemSchema>;
export type UpdateShoppingItemDto = z.infer<typeof UpdateShoppingItemSchema>;
export type GetAllItemsQuery = z.infer<typeof GetAllItemsQuerySchema>;
export type ItemIdParams = z.infer<typeof ItemIdParamsSchema>;