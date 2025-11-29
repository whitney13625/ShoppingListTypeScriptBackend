// src/data/storage.ts

import { ShoppingItem } from '../types/ShoppingItem';


class InMemoryStorage {
  private items: Map<string, ShoppingItem> = new Map();

  // 取得所有項目
  getAll(): ShoppingItem[] {
    return Array.from(this.items.values());
  }

  // 根據 ID 取得單一項目
  getById(id: string): ShoppingItem | undefined {
    return this.items.get(id);
  }

  // 新增項目
  create(item: ShoppingItem): ShoppingItem {
    this.items.set(item.id, item);
    return item;
  }

  // 更新項目
  update(id: string, updates: Partial<ShoppingItem>): ShoppingItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updatedItem = {
      ...item,
      ...updates,
      id: item.id, // 確保 ID 不被更改
      updatedAt: new Date(),
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  // 刪除項目
  delete(id: string): boolean {
    return this.items.delete(id);
  }

  // 清空所有項目（用於測試）
  clear(): void {
    this.items.clear();
  }
}

// 匯出單例實例
export const storage = new InMemoryStorage();