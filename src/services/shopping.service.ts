// src/services/shopping.service.ts

import { IShoppingRepository } from '../repositories/interfaces/shoppingRepository.interface';
import { ICategoryRepository } from '../repositories/interfaces/categoryRepository.interface';
import { ShoppingItem } from '../schemas/shoppingSchemas';
import { ApiError } from '../errors/ApiError';
import { randomUUID } from 'crypto';

export class ShoppingService {
  constructor(
    private shoppingRepository: IShoppingRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async getAllItems(): Promise<ShoppingItem[]> {
    return this.shoppingRepository.getAll();
  }

  async getItemById(id: string): Promise<ShoppingItem> {
    const item = await this.shoppingRepository.getById(id);
    if (!item) {
      throw new ApiError(404, 'Shopping item not found');
    }
    return item;
  }

  async createItem(data: Partial<ShoppingItem>): Promise<ShoppingItem> {
    let categoryId: string | undefined | null = data.categoryId;

    // If categoryName is provided, find or create the category
    if (data.categoryName) {
      let category = await this.categoryRepository.getByName(data.categoryName);
      if (!category) {
        category = await this.categoryRepository.create({ name: data.categoryName });
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

    return this.shoppingRepository.create(newItem);
  }

  async updateItem(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem> {
    let categoryId: string | undefined | null = updates.categoryId;

    // If categoryName is provided, find or create the category
    if (updates.categoryName) {
      let category = await this.categoryRepository.getByName(updates.categoryName);
      if (!category) {
        category = await this.categoryRepository.create({ name: updates.categoryName });
      }
      categoryId = category.id;
    }

    const updatedItem = await this.shoppingRepository.update(id, { ...updates, categoryId });
    if (!updatedItem) {
      throw new ApiError(404, 'Shopping item not found');
    }
    return updatedItem;
  }

  async deleteItem(id: string): Promise<void> {
    const deleted = await this.shoppingRepository.delete(id);
    if (!deleted) {
      throw new ApiError(404, 'Shopping item not found');
    }
  }
}
