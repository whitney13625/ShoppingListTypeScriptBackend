// src/controllers/shoppingController.ts

import { ShoppingService } from '../services/shoppingService';
import { PostgresShoppingRepository } from '../repositories/implementations/postgresShoppingRepository';
import { PostgresCategoryRepository } from '../repositories/implementations/postgresCategoryRepository';
import { withAuth } from '../utils/withAuth';
import { ShoppingItemListResponse } from '../schemas/shoppingSchemas';

// Instantiate repositories and service
const shoppingRepository = new PostgresShoppingRepository();
const categoryRepository = new PostgresCategoryRepository();
const shoppingService = new ShoppingService(shoppingRepository, categoryRepository);

// GET /api/shopping - Get all shopping items
export const getAllItems = withAuth(async (userId, req, res) => {
  
  const items = await shoppingService.getAllItems(userId);
  
  // Filtering and pagination should be in the service layer, but for now, we'll do it here.
  const { categoryId, purchased, page = '1', limit = '10', search } = req.query;

  let filteredItems = items;

  if (categoryId) {
    filteredItems = filteredItems.filter(item => item.categoryId === categoryId);
  }

  if (purchased !== undefined) {
    const isPurchased = purchased === 'true';
    filteredItems = filteredItems.filter(item => item.purchased === isPurchased);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower)
    );
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const result: ShoppingItemListResponse = {
    count: paginatedItems.length,
    total: filteredItems.length,
    page: pageNum,
    totalPages: Math.ceil(filteredItems.length / limitNum),
    data: paginatedItems
  }

  res.status(200).json(result);
});

// GET /api/shopping/:id - Get item by ID
export const getItemById = withAuth(async (userId, req, res) => {
  const { id } = req.params;
  const item = await shoppingService.getItemById(userId, id);
  res.status(200).json(item);
});

// POST /api/shopping - Create item
export const createItem = withAuth(async (userId, req, res) => {
  const createdItem = await shoppingService.createItem(userId, req.body);
  res.status(201).json(createdItem);
});

// PUT /api/shopping/:id - Update item
export const updateItem = withAuth(async (userId, req, res) => {
  const { id } = req.params;
  const updatedItem = await shoppingService.updateItem(userId, id, req.body);
  res.status(200).json(updatedItem);
});

// DELETE /api/shopping/:id - Delete item
export const deleteItem = withAuth(async (userId, req, res) => {
  const { id } = req.params;
    await shoppingService.deleteItem(userId, id);
    res.status(200).send();
});