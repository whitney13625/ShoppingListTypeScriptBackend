// src/schemas/categorySchemas.ts

import '../lib/zodSetup';
import { z } from 'zod';
import { uuidSchema, searchSchema, booleanSchema } from './sharedRules';

const nameSchema = z.string().min(1, 'Name is required').max(50, 'Name is too long');
const descriptionSchema = z.string().max(200, 'Description is too long').optional();
const iconSchema = z.emoji('Icon must be an emoji').optional();
const dateSchema = z.date().openapi({ example: '2025-12-29T10:00:00.000Z' });

// Category schema
export const CategorySchema = z.object({
  id: z.uuid(),
  name: nameSchema.openapi({ example: 'Vegitables' }),
  description: descriptionSchema.openapi({ example: 'Something Green' }),
  icon: iconSchema.openapi({ example: '🥬' }),
  createdAt: dateSchema,
  updatedAt: dateSchema.optional(),
}).openapi({ description: 'Category data object' });

// Schema for query parameters (GET /api/shopping)
export const GetAllCategoriesSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  categoryId: z.uuid('Invalid category ID').optional(),
  purchased: booleanSchema,
  search: searchSchema,
}).openapi({ description: 'Get all Categories' });

export const GetAllCategoriesResponseSchema = z.array(
    CategorySchema
).openapi({ description: 'Response for getting all categories' });  

// Schema for URL parameters with ID
export const CategoryItemIdParamsSchema = z.object({
  id: uuidSchema,
}).openapi({ description: 'Unique ID' });

export const CreateCategorySchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  icon: iconSchema,
}).openapi({ description: 'Create a new Category' });

export const CreateCategoryResponseSchema = CreateCategorySchema.extend({
  id: uuidSchema,
  createdAt: dateSchema
}).openapi({ description: 'Response for Creating a new Category' });

export const UpdateCategorySchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  icon: iconSchema,
}).openapi({ description: 'Update a Category' });

export const UpdateCategoryResponseSchema = CreateCategoryResponseSchema.extend({
  updatedAt: dateSchema
}).openapi({ description: 'Response for Updating a Category' });

export const CategoryIdParamsSchema = z.object({
  id: uuidSchema,
}).openapi({ description: 'Category ID parameter' });


export type Category = z.infer<typeof CategorySchema>;