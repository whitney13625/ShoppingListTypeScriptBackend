// src/routes/categoryRoutes.ts

import { Router } from 'express';
import * as CategorySchemas from '../schemas/categorySchemas';
import { validateBody, validateQuery, validateParams } from '../middleware/zodValidation';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = Router();

// Define all routes with Zod validation middleware

// GET /api/categories
router.get(
  '/',
  validateQuery(CategorySchemas.GetAllCategoriesSchema),
  getAllCategories
);      
// GET /api/categories/:id
router.get(
  '/:id', 
  validateParams(CategorySchemas.CategoryItemIdParamsSchema),
  getCategoryById
);  

// POST /api/categories
router.post(
  '/', 
  validateBody(CategorySchemas.CreateCategorySchema),
  createCategory
);  

// PUT /api/categories/:id 
router.put(
  '/:id', 
  validateParams(CategorySchemas.CategoryItemIdParamsSchema),
  validateBody(CategorySchemas.UpdateCategorySchema),
  updateCategory
);     

// DELETE /api/categories/:id  
router.delete(
  '/:id', 
  validateParams(CategorySchemas.CategoryItemIdParamsSchema),
  deleteCategory
);    

export default router;