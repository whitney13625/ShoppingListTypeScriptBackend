// src/repositories/interfaces/categoryRepository.ts

import { Category } from '../../schemas/categorySchemas';

export interface CategoryRepository {
  getAll(userId: string): Promise<Category[]>;
  getById(userId: string, id: string): Promise<Category | undefined>;
  getByName(userId: string, name: string): Promise<Category | undefined>;
  create(userId: string, category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(userId: string, id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | undefined>;
  delete(userId: string, id: string): Promise<boolean>;
  isInUse(userId: string, id: string): Promise<boolean>;
  getUsageCount(userId: string, id: string): Promise<number>;
}
