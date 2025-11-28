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
import {
  CreateShoppingItemSchema,
  UpdateShoppingItemSchema,
  GetAllItemsQuerySchema,
  ItemIdParamsSchema,
} from '../schemas/shoppingSchemas';

const router = Router();

// Define all routes with Zod validation middleware
router.get(
  '/',
  validateQuery(GetAllItemsQuerySchema),
  getAllItems
);

router.get(
  '/:id',
  validateParams(ItemIdParamsSchema),
  getItemById
);

router.post(
  '/',
  validateBody(CreateShoppingItemSchema),
  createItem
);

router.put(
  '/:id',
  validateParams(ItemIdParamsSchema),
  validateBody(UpdateShoppingItemSchema),
  updateItem
);

router.delete(
  '/:id',
  validateParams(ItemIdParamsSchema),
  deleteItem
);

export default router;