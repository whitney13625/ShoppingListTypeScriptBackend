// src/routes/shoppingRoutes.ts

import { Router } from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/shoppingController';
import { validateBody, validateQuery, validateParams } from '../middleware/zodValidation';
import * as ShoppingSchemas from '../schemas/shoppingSchemas';
import * as SharedSchemas from '../schemas/sharedSchemas';
import { registerRoute } from '../schemas/helper/routeRegistryHelper';

const router = Router();

// Define all routes with Zod validation middleware

// With Swagger registration (DRY Solution, don't need to define in one place and write swagger in the other)
registerRoute(router, {
  method: 'get',
  path: '/api/shopping',    
  tags: ['Shopping'], 
  summary: 'Get all shopping items',
  description: 'Retrieves a list of items with filtering and pagination',
  
  // Key：Define Schema here
  request: {
    query: ShoppingSchemas.GetAllItemsQuerySchema, 
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: ShoppingSchemas.ShoppingItemListResponseSchema} }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: getAllItems, 
});


registerRoute(router, {
  method: 'get',
  path: '/api/shopping/:id',             
  tags: ['Shopping'],    
  summary: 'Get shopping item by ID',
  description: 'Retrieves an item given an ID',
  
  // Key：Define Schema here
  request: {
    params: ShoppingSchemas.ItemIdParamsSchema, 
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: SharedSchemas.ApiSuccessResponseSchema } }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },

  // add Controller
  controller: getItemById, 
});

registerRoute(router, {
  method: 'post',
  path: '/api/shopping/',             
  tags: ['Shopping'],    
  summary: 'Create a new shopping item',
  description: 'Creates a new shopping item, the "name" and "quantity" fields are required.',
  
  request: {
    body: {
      content: {
        'application/json': {
          schema: ShoppingSchemas.CreateShoppingItemSchema,
        },
      },
    }
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: SharedSchemas.ApiSuccessResponseSchema } }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: createItem, 
});

registerRoute(router, {
  method: 'put',
  path: '/api/shopping/:id',             
  tags: ['Shopping'],    
  summary: 'Update a shopping item',
  description: 'Updates an existing shopping item.',
  
  request: {
    query: ShoppingSchemas.ItemIdParamsSchema, 
    body: {
      content: {
        'application/json': {
          schema: ShoppingSchemas.UpdateShoppingItemSchema,
        },
      },
    }
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: SharedSchemas.ApiSuccessResponseSchema } }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: updateItem, 
});

registerRoute(router, {
  method: 'delete',
  path: '/shopping/:id',             
  tags: ['Shopping'],    
  summary: 'Delete a shopping item',
  description: 'Deletes an existing shopping item.',
  
  request: {
    query: ShoppingSchemas.ItemIdParamsSchema
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: SharedSchemas.ApiSuccessResponseSchema } }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: deleteItem, 
});

export default router;