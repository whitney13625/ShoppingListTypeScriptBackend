// src/controllers/shoppingController.ts

import { Request, Response, NextFunction } from 'express';
import { ShoppingService } from '../services/shoppingService';
import { PostgresShoppingRepository } from '../repositories/implementations/postgresShoppingRepository';
import { PostgresCategoryRepository } from '../repositories/implementations/postgresCategoryRepository';
import { GetAllItemsQuery } from '../schemas/shoppingSchemas';

// Instantiate repositories and service
const shoppingRepository = new PostgresShoppingRepository();
const categoryRepository = new PostgresCategoryRepository();
const shoppingService = new ShoppingService(shoppingRepository, categoryRepository);

// GET /api/shopping - Get all shopping items
export const getAllItems = async (
  req: Request<{}, {}, {}, GetAllItemsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await shoppingService.getAllItems();
    
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

    res.status(200).json({
      success: true,
      count: paginatedItems.length,
      total: filteredItems.length,
      page: pageNum,
      totalPages: Math.ceil(filteredItems.length / limitNum),
      data: paginatedItems,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/shopping/:id - Get item by ID
export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await shoppingService.getItemById(id);
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/shopping - Create item
export const createItem = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    const createdItem = await shoppingService.createItem(req.body);
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: createdItem,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/shopping/:id - Update item
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedItem = await shoppingService.updateItem(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/shopping/:id - Delete item
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await shoppingService.deleteItem(id);
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};