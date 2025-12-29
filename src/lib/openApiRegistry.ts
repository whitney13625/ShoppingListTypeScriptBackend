

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import '../lib/zodSetup';
import * as CategorySchemas from '../schemas/categorySchemas';
import * as SharedSchemas from '../schemas/sharedSchemas';

export const registry = new OpenAPIRegistry();
/*
registry.registerPath({
  method: 'get',
  path: '/api/categories',
  description: 'Get a list of categories',
  summary: 'Category List',
  tags: ['Categories'],
  request: {
    query: CategorySchemas.GetAllCategoriesSchema,
  },
  responses: {
    201: {
      description: 'Successfully retrieve a list of categories',
      content: {
        'application/json': {
          schema: CategorySchemas.GetAllCategoriesResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/categories/{id}',
  description: 'Get a category by ID',
  summary: 'Get a Category by ID',
  tags: ['Categories'],
  request: {
    query: CategorySchemas.CategoryItemIdParamsSchema, 
  },
  responses: {
    201: {
      description: 'Successfully created a new category',
      content: {
        'application/json': {
          schema: CategorySchemas.CategorySchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/categories',
  description: 'Create a new category, the "name" field is required.',
  summary: 'Create a new Category',
  tags: ['Categories'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CategorySchemas.CreateCategorySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successfully created a new category',
      content: {
        'application/json': {
          schema: CategorySchemas.CreateCategoryResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/categories/{id}',
  description: 'Update a category, the "id" field is required.',
  summary: 'Update a Category by ID',
  tags: ['Categories'],
  request: {
    query: CategorySchemas.CategoryItemIdParamsSchema, 
    body: {
      content: {
        'application/json': {
          schema: CategorySchemas.UpdateCategorySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successfully created a new category',
      content: {
        'application/json': {
          schema: CategorySchemas.CategorySchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/categories/{id}',
  description: 'Delete a category, the "id" field is required.',
  summary: 'Delete a Category by ID',
  tags: ['Categories'],
  request: {
    query: CategorySchemas.CategoryItemIdParamsSchema, 
  },
  responses: {
    201: {
      description: 'Successfully deleted a new category',
      content: {
        'application/json': {
          schema: SharedSchemas.ApiSuccessResponseSchema,
        },
      },
    },
  },
});
*/