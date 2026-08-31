// src/services/categoryService.ts

import { CategoryRepository } from '../repositories/interfaces/categoryRepository';
import { Category } from '../schemas/categorySchemas';
import { ApiError } from '../errors/ApiError';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.getAll(userId);
  }

  async getCategoryById(userId: string, id: string): Promise<Category> {
    const category = await this.categoryRepository.getById(userId, id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async createCategory(userId: string, data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const existingCategory = await this.categoryRepository.getByName(userId, data.name);
    if (existingCategory) {
      throw new ApiError(409, 'A category with this name already exists.');
    }
    return this.categoryRepository.create(userId, data);
  }

  async updateCategory(userId: string, id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> {
    const category = await this.categoryRepository.update(userId, id, data);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async deleteCategory(userId: string, id: string): Promise<void> {
    const isInUse = await this.categoryRepository.isInUse(userId, id);
    if (isInUse) {
      throw new ApiError(409, 'Cannot delete category that is in use');
    }

    const deleted = await this.categoryRepository.delete(userId, id);
    if (!deleted) {
      throw new ApiError(404, 'Category not found');
    }
  }
}
