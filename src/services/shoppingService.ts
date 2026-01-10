// src/services/shoppingService.ts

import { ShoppingRepository } from '../repositories/interfaces/shoppingRepository';
import { CategoryRepository } from '../repositories/interfaces/categoryRepository';
import { ShoppingItem } from '../schemas/shoppingSchemas';
import { ApiError } from '../errors/ApiError';
import { randomUUID } from 'crypto';

export class ShoppingService {
  constructor(
    private shoppingRepository: ShoppingRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async getAllItems(userId: string): Promise<ShoppingItem[]> {
    return this.shoppingRepository.getAll(userId);
  }

  async getItemById(userId: string, id: string): Promise<ShoppingItem> {
    const item = await this.shoppingRepository.getById(userId, id);
    if (!item) {
      throw new ApiError(404, 'Shopping item not found');
    }
    return item;
  }

  async createItem(userId: string, data: Partial<ShoppingItem>): Promise<ShoppingItem> {
    let categoryId: string | undefined | null = data.categoryId;

    // If categoryName is provided, find or create the category
    if (data.categoryName) {
      let category = await this.categoryRepository.getByName(userId, data.categoryName);
      if (!category) {
        category = await this.categoryRepository.create(userId, { name: data.categoryName });
      }
      categoryId = category.id;
    }

    const newItem: ShoppingItem = {
      id: data.id || randomUUID(),
      name: data.name!,
      quantity: data.quantity || 1,
      purchased: data.purchased || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: categoryId,
    };

    return this.shoppingRepository.create(userId, newItem);
  }

  async updateItem(userId: string, id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem> {
    let categoryId: string | undefined | null = updates.categoryId;

    // If categoryName is provided, find or create the category
    if (updates.categoryName) {
      let category = await this.categoryRepository.getByName(userId, updates.categoryName);
      if (!category) {
        category = await this.categoryRepository.create(userId, { name: updates.categoryName });
      }
      categoryId = category.id;
    }

    const updatedItem = await this.shoppingRepository.update(userId, id, { ...updates, categoryId });
    if (!updatedItem) {
      throw new ApiError(404, 'Shopping item not found');
    }
    return updatedItem;
  }

  async deleteItem(userId: string, id: string): Promise<void> {
    const deleted = await this.shoppingRepository.delete(userId, id);
    if (!deleted) {
      throw new ApiError(404, 'Shopping item not found');
    }
  }
}
