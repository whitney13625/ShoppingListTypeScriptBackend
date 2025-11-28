// src/controllers/shoppingController.ts

import { Request, Response } from 'express';
import { storage } from '../data/storage';
import { 
  ShoppingItem,
  CreateShoppingItemDto,
  UpdateShoppingItemDto,
  GetAllItemsQuery,
  ItemIdParams,
} from '../schemas/shoppingSchemas';
import { v4 as uuidv4 } from 'uuid';

// GET /api/shopping - Get all shopping items
export const getAllItems = (
  req: Request<{}, {}, {}, GetAllItemsQuery>,
  res: Response
) => {
  try {
    // ✅ Process (no validation needed)
    let items = processItems(req.query);
    
    // Parst all fields from TypeScript ( Don't parse page and limit here)
    const { category, purchased, page = '1', limit } = req.query;

    // Parse page and limit directly (Simply for demonstration)
    const pageNum = parseInt(page);
    const limitNum = parseInt(req.query.limit || '10');

    // Filter by category
    if (category) {
      items = items.filter(item => item.category === category);
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
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/shopping/:id - Get item by ID
export const getItemById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = storage.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// POST /api/shopping - Create item
export const createItem = (
  req: Request<{}, {}, CreateShoppingItemDto>, 
  res: Response
) => {
  try {
    const { name, quantity, category } = req.body;

    // Validation is now handled by middleware
    const newItem: ShoppingItem = {
      id: uuidv4(),
      name,
      quantity,
      category,
      purchased: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdItem = storage.create(newItem);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: createdItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// PUT /api/shopping/:id - Update item
export const updateItem = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateShoppingItemDto = req.body;

    // Validation is now handled by middleware
    const updatedItem = storage.update(id, updates);

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// DELETE /api/shopping/:id - Delete item
export const deleteItem = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = storage.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Internal function - no validation
function processItems(query: GetAllItemsQuery): ShoppingItem[] {
  // Trust the data, it's already validated
  return storage.getAll();
}