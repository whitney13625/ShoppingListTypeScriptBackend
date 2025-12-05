
import { z } from 'zod';
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { CreateCategorySchema } from '../schemas/categorySchemas';

export const registry = new OpenAPIRegistry();

// Extend Zod with OpenAPI features (run this once in your app lifecycle)
extendZodWithOpenApi(z);

registry.registerPath({
  method: 'post',
  path: '/categories',
  description: 'Get a list of categories',
  summary: 'Category List',
  tags: ['Categories'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCategorySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: CreateCategorySchema,
        },
      },
    },
  },
});