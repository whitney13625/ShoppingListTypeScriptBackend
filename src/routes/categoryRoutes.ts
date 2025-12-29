// src/routes/categoryRoutes.ts

import { Router } from 'express';
import * as CategorySchemas from '../schemas/categorySchemas';
import * as SharedSchemas from '../schemas/sharedSchemas';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { registerRoute } from '../schemas/helper/routeRegistryHelper';


const router = Router();

// Define all routes with Zod validation middleware
// NOTE: The Swagger is registered in src/lib/openApiRegistry.ts

registerRoute(router, {
  method: 'get',
  path: '/api/categories',    
  tags: ['Categories'], 
  summary: 'Get all Categories',
  description: 'Retrieves a list of categories',
  
  // Key：Define Schema here
  request: {
    query: CategorySchemas.GetAllCategoriesSchema, 
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: CategorySchemas.GetAllCategoriesResponseSchema} }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: getAllCategories, 
});

registerRoute(router, {
  method: 'get',
  path: '/api/categories/:id',    
  tags: ['Categories'], 
  summary: 'Get a Category by ID',
  description: 'Get a category by ID',
  
  // Key：Define Schema here
  request: {
    query: CategorySchemas.CategoryItemIdParamsSchema, 
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: CategorySchemas.CategorySchema} }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: getCategoryById, 
});

registerRoute(router, {
  method: 'post',
  path: '/api/categories',    
  tags: ['Categories'], 
  summary: 'Create a Category',
  description: 'Create a new category, the "name" field is required.',
  
  // Key：Define Schema here
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
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: CategorySchemas.CreateCategoryResponseSchema} }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: createCategory, 
});

registerRoute(router, {
  method: 'put',
  path: '/api/categories/:id', 
  tags: ['Categories'],
  summary: 'Update a Category by ID',
  description: 'Update a category, the "id" field is required.',
  
  request: {
    params: CategorySchemas.CategoryItemIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: CategorySchemas.UpdateCategorySchema,
        },
      },
    },
  },
  
  responses: {
    200: { 
      description: 'Successfully updated category',
      content: {
        'application/json': {
          schema: CategorySchemas.CategorySchema,
        },
      },
    },
    404: {
        description: 'Category not found'
    }
  },
  controller: updateCategory,
});

registerRoute(router, {
  method: 'delete',
  path: '/api/categories/:id', 
  tags: ['Categories'],
  summary: 'Delete a Category by ID',
  description: 'Delete a category, the "id" field is required.',
  
  request: {
    params: CategorySchemas.CategoryItemIdParamsSchema,
  },
  
  responses: {
    200: {
      description: 'Successfully deleted category',
      content: {
        'application/json': {
          schema: SharedSchemas.ApiSuccessResponseSchema,
        },
      },
    },
    404: {
        description: 'Category not found'
    }
  },
  
  // 綁定 Controller
  controller: deleteCategory,
});

export default router;