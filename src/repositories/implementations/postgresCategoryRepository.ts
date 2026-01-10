// src/repositories/implementations/postgresCategoryRepository.ts

import { pool } from '../../config/database';
import { Category } from '../../schemas/categorySchemas';
import { CategoryRepository } from '../interfaces/categoryRepository';

export class PostgresCategoryRepository implements CategoryRepository {
  async getAll(userId: string): Promise<Category[]> {
    const result = await pool.query(`
      SELECT * FROM shopping_categories
      WHERE user_id = $1
      ORDER BY name ASC
    `, [userId]);
    
    return result.rows.map(this.mapRowToCategory);
  }

  async getById(userId: string, id: string): Promise<Category | undefined> {
    const result = await pool.query(
      `SELECT * FROM shopping_categories WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToCategory(result.rows[0]);
  }

  async getByName(userId: string, name: string): Promise<Category | undefined> {
    const result = await pool.query(
      `SELECT * FROM shopping_categories WHERE name = $1 AND user_id = $2`,
      [name, userId]
    );
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToCategory(result.rows[0]);
  }

  async create(userId: string, category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const result = await pool.query(
      `INSERT INTO shopping_categories (name, description, icon, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [category.name, category.description || null, category.icon || null, userId]
    );
    
    return this.mapRowToCategory(result.rows[0]);
  }

  async update(
    userId: string,
    id: string,
    updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Category | undefined> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    
    if (updates.icon !== undefined) {
      fields.push(`icon = $${paramCount++}`);
      values.push(updates.icon);
    }
    
    if (fields.length === 0) {
      return this.getById(userId, id);
    }
    
    values.push(id, userId);
    
    const query = `
      UPDATE shopping_categories 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount++} AND user_id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToCategory(result.rows[0]);
  }

  async delete(userId: string, id: string): Promise<boolean> {
    try {
      const result = await pool.query(
        `DELETE FROM shopping_categories WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error: any) {
      if (error.message.includes('Cannot delete category that is in use')) {
        throw new Error('Cannot delete category that is in use');
      }
      throw error;
    }
  }

  async isInUse(userId: string, id: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM shopping_items WHERE category_id = $1 AND user_id = $2) as in_use`,
      [id, userId]
    );
    
    return result.rows[0].in_use;
  }

  async getUsageCount(userId: string, id: string): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM shopping_items WHERE category_id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    return parseInt(result.rows[0].count);
  }

  private mapRowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
