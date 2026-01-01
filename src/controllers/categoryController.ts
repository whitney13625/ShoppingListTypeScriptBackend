// src/controllers/categoryController.ts

import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CategoryPostgresRepository } from '../repositories/implementations/category.postgres.repository';

// Instantiate the service with the repository
const categoryRepository = new CategoryPostgresRepository();
const categoryService = new CategoryService(categoryRepository);

// GET /api/categories - Get all categories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeCount = req.query.includeCount === 'true';
    const categories = await categoryService.getAllCategories();

    if (includeCount) {
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => ({
          ...category,
          itemCount: await categoryRepository.getUsageCount(category.id),
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
    const category = await categoryService.getCategoryById(id);

    const includeCount = req.query.includeCount === 'true';
    const response: any = { ...category };
    
    if (includeCount) {
      response.itemCount = await categoryRepository.getUsageCount(id);
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
    const newCategory = await categoryService.createCategory(req.body);
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
    const updatedCategory = await categoryService.updateCategory(id, req.body);
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
    await categoryService.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};