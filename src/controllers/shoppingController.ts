// src/controllers/shoppingController.ts

import { Request, Response, NextFunction } from 'express';
import { storage } from '../data/shoppingStorage';
import { 
  ShoppingItem,
  ShoppingItemWithCategory,
  CreateShoppingItemDto,
  UpdateShoppingItemDto,
  GetAllItemsQuery,
} from '../schemas/shoppingSchemas';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../errors/ApiError';

// GET /api/shopping - Get all shopping items
export const getAllItems = async (
  req: Request<{}, {}, {}, GetAllItemsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    
    // ✅ Process (no validation needed)
    let items = await processItems(req.query);
    
    // Ensure items is an array
    if (!Array.isArray(items)) {
      return next(new ApiError(500, 'Database returned invalid data'));
    }

    // Parst all fields from TypeScript ( Don't parse page and limit here)
    const { categoryId, purchased, page = '1', limit } = req.query;

    // Parse page and limit directly (Simply for demonstration)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit || '10');  // Another way for setting default value

    // Filter by category
    if (categoryId) {
      items = items.filter(item => item.categoryId === categoryId);
    }

    // Filter by purchased status if no validation
    if (purchased !== undefined) {
      const isPurchased = purchased === 'true';
      items = items.filter(item => item.purchased === isPurchased);
    }
    
    // Search by name
    const search = req.query.search as String; // Parsing by Type Assersion (for demonstration only)
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    items.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedItems = items.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedItems.length,
      total: items.length,
      page,
      totalPages: Math.ceil(items.length / limitNum),
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
    const item = await storage.getById(id);

    if (!item) {
      return next(new ApiError(404, 'Item not found'));
    }

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
  req: Request<{}, {}, CreateShoppingItemDto>, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, quantity, categoryId, categoryName } = req.body;

    // Validation is now handled by middleware
    const newItem: ShoppingItem = {
      id: uuidv4(),
      name,
      quantity,
      categoryId: categoryId || null,
      categoryName: categoryName || null,
      purchased: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdItem = await storage.create(newItem);

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
    const updates: UpdateShoppingItemDto = req.body;

    // Validation is now handled by middleware
    const updatedItem = await storage.update(id, updates);

    if (!updatedItem) {
      return next(new ApiError(404, 'Item not found'));
    }

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
    const deleted = await storage.delete(id);

    if (!deleted) {
      return next(new ApiError(404, 'Item not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Internal function - no validation
async function processItems(query: GetAllItemsQuery): Promise<ShoppingItemWithCategory[]> {
  // Trust the data, it's already validated
  return await storage.getAll();
}