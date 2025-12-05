// src/controllers/categoryController.ts

import { Request, Response } from 'express';
import { categoryStorage } from '../data/categoryStorage';
import { z } from 'zod';

// Validation schemas
const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  description: z.string().max(200, 'Description must be at most 200 characters').optional(),
  icon: z.string().max(50, 'Icon must be at most 50 characters').optional(),
});

const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  icon: z.string().max(50).optional(),
});

const CategoryIdParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

// Helper function to format Zod errors
const formatZodErrors = (issues: any[]) => {
  return issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};

// GET /api/categories - Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryStorage.getAll();
    
    // Optionally include usage count for each category
    const includeCount = req.query.includeCount === 'true';
    
    if (includeCount) {
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => ({
          ...category,
          itemCount: await categoryStorage.getUsageCount(category.id),
        }))
      );
      
      return res.status(200).json({
        success: true,
        count: categoriesWithCount.length,
        data: categoriesWithCount,
      });
    }
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('GetAllCategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// GET /api/categories/:id - Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    // Validate params
    const paramsResult = CategoryIdParamsSchema.safeParse(req.params);
    
    if (!paramsResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL parameters',
        errors: formatZodErrors(paramsResult.error.issues),
      });
    }
    
    const { id } = paramsResult.data;
    const category = await categoryStorage.getById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Optionally include usage count
    const includeCount = req.query.includeCount === 'true';
    const response: any = { ...category };
    
    if (includeCount) {
      response.itemCount = await categoryStorage.getUsageCount(id);
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('GetCategoryById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// POST /api/categories - Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Validate body
    const bodyResult = CreateCategorySchema.safeParse(req.body);
    
    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: formatZodErrors(bodyResult.error.issues),
      });
    }
    
    const { name, description, icon } = bodyResult.data;

    // Check if category name already exists
    const existing = await categoryStorage.getByName(name);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const newCategory = await categoryStorage.create({
      name,
      description,
      icon,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    console.error('CreateCategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// PUT /api/categories/:id - Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    // Validate params
    const paramsResult = CategoryIdParamsSchema.safeParse(req.params);
    
    if (!paramsResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL parameters',
        errors: formatZodErrors(paramsResult.error.issues),
      });
    }
    
    // Validate body
    const bodyResult = UpdateCategorySchema.safeParse(req.body);
    
    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: formatZodErrors(bodyResult.error.issues),
      });
    }
    
    const { id } = paramsResult.data;
    const updates = bodyResult.data;

    // If updating name, check for conflicts
    if (updates.name) {
      const existing = await categoryStorage.getByName(updates.name);
      if (existing && existing.id !== id) {
        return res.status(409).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
    }

    const updatedCategory = await categoryStorage.update(id, updates);

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    console.error('UpdateCategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// DELETE /api/categories/:id - Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    // Validate params
    const paramsResult = CategoryIdParamsSchema.safeParse(req.params);
    
    if (!paramsResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL parameters',
        errors: formatZodErrors(paramsResult.error.issues),
      });
    }
    
    const { id } = paramsResult.data;

    // Check if category is in use
    const inUse = await categoryStorage.isInUse(id);
    if (inUse) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete category that is in use by shopping items',
      });
    }

    const deleted = await categoryStorage.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('DeleteCategory error:', error);
    
    // Handle specific error from trigger
    if (error instanceof Error && error.message.includes('in use')) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete category that is in use by shopping items',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};