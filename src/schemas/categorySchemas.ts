// src/schemas/categorySchemas.ts

import '../lib/zodSetup';
import { z } from 'zod';

// Category schema
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50).openapi({ example: 'Vegitables' }),
  description: z.string().optional().openapi({ example: 'Something Green' }),
  icon: z.string().optional().openapi({ example: '🥬' }),
  createdAt: z.date().openapi({ example: '2025-12-29T10:00:00.000Z' }),
  updatedAt: z.date().openapi({ example: '2025-12-29T10:00:00.000Z' }),
}).openapi({ description: 'Category data object' });

// Schema for query parameters (GET /api/shopping)
export const GetAllCategoriesSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  purchased: z.enum(['true', 'false']).optional().openapi({ example: 'true' }),
  search: z.string().min(1).max(100).optional().openapi({ example: '10' }),
}).openapi({ description: 'Get all Categories' });

export const GetAllCategoriesResponseSchema = z.array(
    CategorySchema
).openapi({ description: 'Response for getting all categories' });  

// Schema for URL parameters with ID
export const CategoryItemIdParamsSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
}).openapi({ description: 'Unique ID' });

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  description: z.string().max(200, 'Description must be at most 200 characters').optional(),
  icon: z.string().max(50, 'Icon must be at most 50 characters').optional(),
}).openapi({ description: 'Create a new Category' });

export const CreateCategoryResponseSchema = CreateCategorySchema.extend({
  id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
  createdAt: z.date().openapi({ example: '2025-12-29T10:00:00.000Z' })
}).openapi({ description: 'Response for Creating a new Category' });

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  icon: z.string().max(50).optional(),
}).openapi({ description: 'Update a Category' });

export const UpdateCategoryResponseSchema = CreateCategoryResponseSchema.extend({
  updatedAt: z.date().openapi({ example: '2025-12-29T10:00:00.000Z' })
}).openapi({ description: 'Response for Updating a Category' });

export const CategoryIdParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
}).openapi({ description: 'Category ID parameter' });


export type Category = z.infer<typeof CategorySchema>;