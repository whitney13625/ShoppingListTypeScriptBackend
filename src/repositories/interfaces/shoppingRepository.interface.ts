// src/repositories/interfaces/shoppingRepository.interface.ts

import { ShoppingItem } from '../../schemas/shoppingSchemas';

export interface IShoppingRepository {
  getAll(): Promise<ShoppingItem[]>;
  getById(id: string): Promise<ShoppingItem | undefined>;
  create(item: ShoppingItem): Promise<ShoppingItem>;
  update(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
}
