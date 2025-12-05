// src/schemas/categorySchemas.ts

import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  description: z.string().max(200, 'Description must be at most 200 characters').optional(),
  icon: z.string().max(50, 'Icon must be at most 50 characters').optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  icon: z.string().max(50).optional(),
});

export const CategoryIdParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
export type CategoryIdParams = z.infer<typeof CategoryIdParamsSchema>;
