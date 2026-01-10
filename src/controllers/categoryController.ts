// src/controllers/categoryController.ts

import { CategoryService } from '../services/categoryService';
import { PostgresCategoryRepository } from '../repositories/implementations/postgresCategoryRepository';
import { withAuth } from '../utils/withAuth';

// Instantiate the service with the repository
const categoryRepository = new PostgresCategoryRepository();
const categoryService = new CategoryService(categoryRepository);

// GET /api/categories - Get all categories
export const getAllCategories = withAuth(async (userId, req, res) => {
  if (!userId) {
    return res.status(401).json({ error: "User identity not found" });
  }

  const includeCount = req.query.includeCount === 'true';
  const categories = await categoryService.getAllCategories(userId);

  if (includeCount) {
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => ({
        ...category,
        itemCount: await categoryRepository.getUsageCount(userId, category.id),
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
});

// GET /api/categories/:id - Get category by ID
export const getCategoryById = withAuth(async (userId, req, res) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(userId, id);

  const includeCount = req.query.includeCount === 'true';
  const response: any = { ...category };
  
  if (includeCount) {
    response.itemCount = await categoryRepository.getUsageCount(userId, id);
  }

  res.status(200).json({
    success: true,
    data: response,
  });
});

// POST /api/categories - Create new category
export const createCategory = withAuth(async (userId, req, res) => {
  const newCategory = await categoryService.createCategory(userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
});

// PUT /api/categories/:id - Update category
export const updateCategory = withAuth(async (userId, req, res) => {
  const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(userId, id, req.body);
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
});

// DELETE /api/categories/:id - Delete category
export const deleteCategory = withAuth(async (userId, req, res) => {
  const { id } = req.params;
    await categoryService.deleteCategory(userId, id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
});