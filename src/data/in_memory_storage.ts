// src/data/storage.ts

import { ShoppingItem } from '../schemas/shoppingSchemas';


class InMemoryStorage {
  private items: Map<string, ShoppingItem> = new Map();

  // Get all items
  getAll(): ShoppingItem[] {
    return Array.from(this.items.values());
  }

  // Get item by ID
  getById(id: string): ShoppingItem | undefined {
    return this.items.get(id);
  }

  // Create new item
  create(item: ShoppingItem): ShoppingItem {
    this.items.set(item.id, item);
    return item;
  }

  // Update item
  update(id: string, updates: Partial<ShoppingItem>): ShoppingItem | undefined {
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

  // Delete item
  delete(id: string): boolean {
    return this.items.delete(id);
  }

  // Clear all items (for testing purposes)
  clear(): void {
    this.items.clear();
  }
}

// 匯出單例實例
export const storage = new InMemoryStorage();