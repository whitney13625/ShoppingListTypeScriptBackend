// src/repositories/implementations/inMemoryCategoryRepository.ts

import { Category } from '../../schemas/categorySchemas';
import { CategoryRepository } from '../interfaces/categoryRepository';
import { randomUUID } from 'crypto';

export class InMemoryCategoryRepository implements CategoryRepository {
  private userCategories: Map<string, Map<string, Category>> = new Map();
  private userShoppingItems: Map<string, Map<string, { categoryId?: string }>> = new Map(); // Simplified for this repo

  private getCategoriesForUser(userId: string): Map<string, Category> {
    if (!this.userCategories.has(userId)) {
      this.userCategories.set(userId, new Map());
    }
    return this.userCategories.get(userId)!;
  }

  private getShoppingItemsForUser(userId: string): Map<string, { categoryId?: string }> {
    if (!this.userShoppingItems.has(userId)) {
      this.userShoppingItems.set(userId, new Map());
    }
    return this.userShoppingItems.get(userId)!;
  }

  async getAll(userId: string): Promise<Category[]> {
    const categories = this.getCategoriesForUser(userId);
    return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(userId: string, id: string): Promise<Category | undefined> {
    const categories = this.getCategoriesForUser(userId);
    return categories.get(id);
  }

  async getByName(userId: string, name: string): Promise<Category | undefined> {
    const categories = this.getCategoriesForUser(userId);
    return Array.from(categories.values()).find(c => c.name === name);
  }

  async create(userId: string, categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const categories = this.getCategoriesForUser(userId);
    const newCategory: Category = {
      id: randomUUID(),
      ...categoryData,
      createdAt: new Date(),
      description: categoryData.description || undefined,
      icon: categoryData.icon || undefined,
    };
    categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async update(userId: string, id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | undefined> {
    const categories = this.getCategoriesForUser(userId);
    const existing = categories.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Category = { ...existing, ...updates, updatedAt: new Date() };
    categories.set(id, updated);
    return updated;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const categories = this.getCategoriesForUser(userId);
    if (await this.isInUse(userId, id)) {
        return false;
    }
    return categories.delete(id);
  }

  async isInUse(userId: string, id: string): Promise<boolean> {
    const shoppingItems = this.getShoppingItemsForUser(userId);
    return Array.from(shoppingItems.values()).some(item => item.categoryId === id);
  }

  async getUsageCount(userId: string, id: string): Promise<number> {
    const shoppingItems = this.getShoppingItemsForUser(userId);
    return Array.from(shoppingItems.values()).filter(item => item.categoryId === id).length;
  }

  // Helper for tests
  public setItems(userId: string, items: Map<string, { categoryId?: string }>) {
    this.userShoppingItems.set(userId, items);
  }

  public clear() {
    this.userCategories.clear();
    this.userShoppingItems.clear();
  }
}
