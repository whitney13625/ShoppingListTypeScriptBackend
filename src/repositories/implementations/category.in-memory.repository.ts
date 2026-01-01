// src/repositories/implementations/category.in-memory.repository.ts

import { Category } from '../../schemas/categorySchemas';
import { ICategoryRepository } from '../interfaces/categoryRepository.interface';
import { randomUUID } from 'crypto';

export class CategoryInMemoryRepository implements ICategoryRepository {
  private categories: Map<string, Category> = new Map();
  private shoppingItems: Map<string, { categoryId?: string }> = new Map(); // Simplified for this repo

  async getAll(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.name === name);
  }

  async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const newCategory: Category = {
      id: randomUUID(),
      ...categoryData,
      createdAt: new Date(),
      description: categoryData.description || undefined,
      icon: categoryData.icon || undefined,
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async update(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Category = { ...existing, ...updates, updatedAt: new Date() };
    this.categories.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (await this.isInUse(id)) {
        throw new Error('Cannot delete category that is in use');
    }
    return this.categories.delete(id);
  }

  async isInUse(id: string): Promise<boolean> {
    return Array.from(this.shoppingItems.values()).some(item => item.categoryId === id);
  }

  async getUsageCount(id: string): Promise<number> {
    return Array.from(this.shoppingItems.values()).filter(item => item.categoryId === id).length;
  }

  // Helper for tests
  public setItems(items: Map<string, { categoryId?: string }>) {
    this.shoppingItems = items;
  }

  public clear() {
    this.categories.clear();
  }
}
