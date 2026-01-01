// src/repositories/interfaces/categoryRepository.interface.ts

import { Category } from '../../schemas/categorySchemas';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | undefined>;
  getByName(name: string): Promise<Category | undefined>;
  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | undefined>;
  delete(id: string): Promise<boolean>;
  isInUse(id: string): Promise<boolean>;
  getUsageCount(id: string): Promise<number>;
}
