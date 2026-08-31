// src/repositories/implementations/inMemoryShoppingRepository.ts

import { ShoppingItem } from '../../schemas/shoppingSchemas';
import { ShoppingRepository } from '../interfaces/shoppingRepository';

export class InMemoryShoppingRepository implements ShoppingRepository {
  private userItems: Map<string, Map<string, ShoppingItem>> = new Map();

  private getItemsForUser(userId: string): Map<string, ShoppingItem> {
    if (!this.userItems.has(userId)) {
      this.userItems.set(userId, new Map());
    }
    return this.userItems.get(userId)!;
  }

  async getAll(userId: string): Promise<ShoppingItem[]> {
    const items = this.getItemsForUser(userId);
    return Array.from(items.values());
  }

  async getById(userId: string, id: string): Promise<ShoppingItem | undefined> {
    const items = this.getItemsForUser(userId);
    return items.get(id);
  }

  async create(userId: string, item: ShoppingItem): Promise<ShoppingItem> {
    const items = this.getItemsForUser(userId);
    items.set(item.id, item);
    return item;
  }

  async update(userId: string, id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined> {
    const items = this.getItemsForUser(userId);
    const item = items.get(id);
    if (!item) return undefined;

    const updatedItem = {
      ...item,
      ...updates,
      id: item.id, // Make sure ID doesn't change
      updatedAt: new Date(),
    };

    items.set(id, updatedItem);
    return updatedItem;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const items = this.getItemsForUser(userId);
    return items.delete(id);
  }

  async clear(userId: string): Promise<void> {
    const items = this.getItemsForUser(userId);
    items.clear();
  }
}
