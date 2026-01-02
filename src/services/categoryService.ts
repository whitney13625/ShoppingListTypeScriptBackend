// src/services/categoryService.ts

import { CategoryRepository } from '../repositories/interfaces/categoryRepository';
import { Category } from '../schemas/categorySchemas';
import { ApiError } from '../errors/ApiError';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const existingCategory = await this.categoryRepository.getByName(data.name);
    if (existingCategory) {
      throw new ApiError(409, 'A category with this name already exists.');
    }
    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> {
    const category = await this.categoryRepository.update(id, data);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const isInUse = await this.categoryRepository.isInUse(id);
    if (isInUse) {
      throw new ApiError(409, 'Cannot delete category that is in use');
    }

    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new ApiError(404, 'Category not found');
    }
  }
}
