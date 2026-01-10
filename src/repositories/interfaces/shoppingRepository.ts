// src/repositories/interfaces/shoppingRepository.ts

import { ShoppingItem } from '../../schemas/shoppingSchemas';

export interface ShoppingRepository {
  getAll(userId: string): Promise<ShoppingItem[]>;
  getById(userId: string, id: string): Promise<ShoppingItem | undefined>;
  create(userId: string, item: ShoppingItem): Promise<ShoppingItem>;
  update(userId: string, id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined>;
  delete(userId: string, id: string): Promise<boolean>;
  clear(userId: string, ): Promise<void>;
}
