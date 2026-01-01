// src/repositories/implementations/shopping.in-memory.repository.ts

import { ShoppingItem } from '../../schemas/shoppingSchemas';
import { IShoppingRepository } from '../interfaces/shoppingRepository.interface';

export class ShoppingInMemoryRepository implements IShoppingRepository {
  private items: Map<string, ShoppingItem> = new Map();

  async getAll(): Promise<ShoppingItem[]> {
    return Array.from(this.items.values());
  }

  async getById(id: string): Promise<ShoppingItem | undefined> {
    return this.items.get(id);
  }

  async create(item: ShoppingItem): Promise<ShoppingItem> {
    this.items.set(item.id, item);
    return item;
  }

  async update(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updatedItem = {
      ...item,
      ...updates,
      id: item.id, // Make sure ID doesn't change
      updatedAt: new Date(),
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
  }
}
