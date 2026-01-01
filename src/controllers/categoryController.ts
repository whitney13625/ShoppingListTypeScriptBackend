// src/controllers/categoryController.ts

import { Request, Response, NextFunction } from 'express';
import { categoryStorage } from '../data/categoryStorage';
import * as CategorySchemas from '../schemas/categorySchemas';
import { ApiError } from '../errors/ApiError';


// GET /api/categories - Get all categories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
};

// GET /api/categories/:id - Get category by ID
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryStorage.getById(id);

    if (!category) {
      return next(new ApiError(404, 'Category not found'));
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
    next(error);
  }
};

// POST /api/categories - Create new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, icon } = req.body;

    // Check if category name already exists
    const existing = await categoryStorage.getByName(name);
    if (existing) {
      return next(new ApiError(409, 'Category with this name already exists'));
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
    next(error);
  }
};

// PUT /api/categories/:id - Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If updating name, check for conflicts
    if (updates.name) {
      const existing = await categoryStorage.getByName(updates.name);
      if (existing && existing.id !== id) {
        return next(new ApiError(409, 'Category with this name already exists'));
      }
    }

    const updatedCategory = await categoryStorage.update(id, updates);

    if (!updatedCategory) {
      return next(new ApiError(404, 'Category not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id - Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if category is in use
    const inUse = await categoryStorage.isInUse(id);
    if (inUse) {
      return next(new ApiError(409, 'Cannot delete category that is in use by shopping items'));
    }

    const deleted = await categoryStorage.delete(id);

    if (!deleted) {
      return next(new ApiError(404, 'Category not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    // Handle specific error from trigger
    if (error instanceof Error && error.message.includes('in use')) {
      return next(new ApiError(409, 'Cannot delete category that is in use by shopping items'));
    }
    next(error);
  }
};